const mongoose = require('mongoose');
const Order = require('../models/Order');
const { STATUS_ORDER } = require('../data/Status');
const OrderDetail = require('../models/OrderDetail');
const ApiResponse = require('../utils/ApiResponse');
const Product = require('../models/Product');

const save = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const cart = req.body;

        const errors = [];

        for (const detail of cart.details) {
            const productId = new mongoose.Types.ObjectId(detail.productId);

            const updated = await Product.findOneAndUpdate(
                {
                    _id: productId,
                    $expr: {
                        $gte: [
                            { $subtract: ["$stock", "$reservedStock"] },
                            detail.quantity
                        ]
                    }
                },
                {
                    $inc: { reservedStock: detail.quantity }
                },
                {
                    new: true,
                    session
                }
            );

            if (!updated) {
                const product = await Product.findById(productId).session(session);
                const availableStock = product.stock - product.reservedStock;
                errors.push(
                    `Insufficient stock for ${detail.productName}, available: ${availableStock}`
                );
            }
        }

        if (errors.length > 0) {
            await session.abortTransaction();
            return res.status(409).json(ApiResponse.error(
                409, 
                'Insufficient stock', 
                errors
            ));
        }

        const order = new Order({
            date: new Date(),
            clientId: cart.clientId,
            shopId: cart.shopId,
            total: cart.total,
            nbArticles: cart.nbArticles,
            status: STATUS_ORDER.UNPAID
        });

        await order.save({ session });

        const orderDetails = cart.details.map(detail => ({
            orderId: order._id,
            quantity: detail.quantity,
            price: detail.price,
            productId: detail.productId,
            productName: detail.productName,
            productUom: detail.productUom,
            productUomId: detail.productUomId,
            productPicture: detail.productPicture,
            productCategory: detail.productCategory,
            productCategoryId: detail.productCategoryId
        }));

        await OrderDetail.insertMany(orderDetails, { session });

        await session.commitTransaction();

        return res.status(201).json( ApiResponse.succes(
            201, 
            'Order created successfully', 
            { order }
        )
        );

    } catch (err) {
        await session.abortTransaction();
        return res.status(500).json(
            ApiResponse.error(500, 'Error creating order', [err.message])
        );
    } finally {
        session.endSession();
    }
}


const getAll = async (req, res) => {
    try {
        const { shopId, clientId } = req.params;

        if(!shopId || !clientId){
            return res.status(500).json(ApiResponse.error(
                500,
                'Error when retrieving the order',
                ['No body provided (Shop Id and Client Id)']
            ));
        }

        const orders = await Order.find({
            shopId : shopId,
            clientId: clientId
        }).sort({ date: -1 });

        return res.status(200).json(ApiResponse.succes(
            200,
            'Orders record(s)',
            orders
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving orders',
            [err.message]
        ));
    }
}

const getByShop = async (req, res) => {
    try {
        const { shopId } = req.params;

        if(!shopId){
            return res.status(500).json(ApiResponse.error(
                500,
                'Error when retrieving the order',
                ['No body provided (Shop Id)']
            ));
        }

        const orders = await Order.find({
            shopId : shopId
        }).sort({ date: -1 });

        return res.status(200).json(ApiResponse.succes(
            200,
            'Orders record(s)',
            orders
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving orders',
            [err.message]
        ));
    }
}

const getById = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        
        if (!orderId) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error fetching order details',
                ['No orderId provided']
            ));
        }

        const order = await Order.findById(orderId);

        const orderDetails = await OrderDetail.find({
            orderId: orderId
        });

        return res.status(200).json(ApiResponse.succes(
            200,
            'Order details record(s)',
            {
                order,
                orderDetails
            }
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving order details',
            [err.message]
        ));
    }
};

const updateStatusOrder = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error fetching order details',
                ['No orderId provided']
            ));
        }

        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating product',
                ['No information provided']
            ));
        }
        
        const order = await Order.findByIdAndUpdate(
            orderId,
            req.body
        ).session(session);

        if (req.body.status === STATUS_ORDER.CANCELED) {
            const orderDetails = await OrderDetail.find({
                orderId: orderId
            }).session(session);

            for (const detail of orderDetails) {
                await Product.findOneAndUpdate(
                    {
                        _id: detail.productId
                    },
                    {
                        $inc: { reservedStock: -detail.quantity }
                    },
                    {
                        new: true,
                        session
                    }
                );
            }
        }

        await session.commitTransaction();

        return res.status(200).json(ApiResponse.succes(
            200,
            'Status Order updated',
            order
        ));

    } catch (err) {
        await session.abortTransaction();
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating status order',
            [err.message]
        ));
    } finally {
        session.endSession();
    }
}

module.exports.save = save
module.exports.getAll = getAll
module.exports.getById = getById
module.exports.updateStatusOrder = updateStatusOrder
module.exports.getByShop = getByShop;