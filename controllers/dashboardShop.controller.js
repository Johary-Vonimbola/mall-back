const mongoose = require('mongoose');
const ApiResponse = require('../utils/ApiResponse');
const OrderDetail = require('../models/OrderDetail');
const Order = require('../models/Order');
const ShopRent = require('../models/ShopRent');
const { STATUS_ORDER } = require('../data/Status');

const getDashboardShop = async (req, res) => {
    try {

        const { shopId } = req.params;

        if (!shopId) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error retrieving dashboard',
                ['ShopId is required']
            ));
        }

        const currentDate = new Date();

        const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const startOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

        const VALID_STATUS = [
            STATUS_ORDER.PAID,
            STATUS_ORDER.IN_PROGRESS_DELIVERY,
            STATUS_ORDER.DELIVERED
        ];

        // ==========================
        // CHIFFRE D'AFFAIRE
        // ==========================
        const currentMonthSales = await Order.aggregate([
            {
                $match: {
                    shopId: new mongoose.Types.ObjectId(shopId),
                    status: { $in: VALID_STATUS },
                    date: {
                        $gte: startOfCurrentMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" }
                }
            }
        ]);

        const previousMonthSales = await Order.aggregate([
            {
                $match: {
                    shopId: new mongoose.Types.ObjectId(shopId),
                    status: { $in: VALID_STATUS },
                    date: {
                        $gte: startOfPreviousMonth,
                        $lt: startOfCurrentMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" }
                }
            }
        ]);

        const currentCA = currentMonthSales[0]?.total || 0;
        const previousCA = previousMonthSales[0]?.total || 0;

        const salesEvolution = previousCA === 0 ? 100 :
            ((currentCA - previousCA) / previousCA) * 100;

        // ==========================
        // PRODUIT PLUS VENDU
        // ==========================
        const bestProduct = await OrderDetail.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "order"
                }
            },
            { $unwind: "$order" },
            {
                $match: {
                    "order.shopId": new mongoose.Types.ObjectId(shopId),
                    "order.status": { $in: VALID_STATUS },
                    "order.date": {
                        $gte: startOfCurrentMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: "$productId",
                    name: { $first: "$productName" },
                    quantity: { $sum: "$quantity" }
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 1 }
        ]);

        // ==========================
        // LOYER
        // ==========================
        const rent = await ShopRent.findOne({
            shopId: shopId,
            isActive: true
        });

        const rentAmount = rent?.amount || 0;

        // ==========================
        // BENEFICE
        // ==========================
        const profit = currentCA - rentAmount;

        return res.status(200).json(ApiResponse.succes(
            200,
            'Dashboard data',
            {
                chiffreAffaire: currentCA,
                previousMonthCA: previousCA,
                evolutionCA: salesEvolution,
                bestProduct: bestProduct[0] || null,
                rent: rentAmount,
                profit: profit
            }
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving dashboard',
            [err.message]
        ));
    }
};

module.exports.getDashboardShop = getDashboardShop;