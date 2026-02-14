const Cart = require('../models/Cart');
const ApiResponse = require('../utils/ApiResponse');

const save = async (req,res)=>{
    try{

        const {clientId,shopId,details} = req.body;

        const total = details.reduce((sum,item)=> sum + (item.price * item.quantity),0);
        const nbArticles = details.reduce((sum,item)=> sum + item.quantity,0);

        const cart = await Cart.create({
            date:new Date(),
            clientId,
            shopId,
            details,
            total,
            nbArticles
        });

        return res.status(201).json(ApiResponse.succes(
            201,
            "Cart created",
            cart
        ));

    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500,
            "Error creating cart",
            [err.message]
        ));
    }
}

const addProduct = async(req,res)=>{
    try{
        const { id } = req.params;
        const product = req.body;

        const cart = await Cart.findByIdAndUpdate(
            id,
            {
                $push: { details: product },
                $inc: {
                    nbArticles: product.quantity,
                    total: product.price * product.quantity
                }
            },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json(ApiResponse.error(
                404, 
                "Cart not found", 
                ["Cart does not exist"])
            );
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            "Product added",
            cart
        ));

    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500,
            "Error adding product",
            [err.message]
        ));
    }
}

const addQuantity = async (req, res) => {
    try {
        const { id, productId } = req.params;
        const { quantity, price } = req.body;

        if (!quantity || !price) {
            return res.status(400).json(ApiResponse.error(
                400,
                "Missing data",
                ["quantity or price is missing"]
            ));
        }

        const cart = await Cart.findOneAndUpdate(
            { _id: id, "details.productId": productId },
            {
                $inc: {
                    "details.$.quantity": Number(quantity),
                    nbArticles: Number(quantity),
                    total: Number(price) * Number(quantity)
                }
            },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json(ApiResponse.error(
                404,
                "Cart or product not found",
                ["Cart or product does not exist"]
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            "Quantity updated",
            cart
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error updating quantity",
            [err.message]
        ));
    }
};

const removeProduct = async(req,res)=>{
    try{
        const { id, productId } = req.params;

        let cart = await Cart.findById(id);

        if (!cart) {
            return res.status(404).json(ApiResponse.error(
                404, 
                "Cart not found", 
                ["Cart does not exist"])
            );
        }

        const detail = cart.details.find(
            d => d.productId == productId
        );

        if (!detail) {
            return res.status(404).json(ApiResponse.error(
                404, 
                "Product not found", 
                ["Product does not exist in cart"])
            );
        }

        const quantity = detail.quantity;
        const price = detail.price;

        cart = await Cart.findByIdAndUpdate(
            id,
            {
                $pull: { details: { productId: productId } },
                $inc: {
                    nbArticles: -quantity,
                    total: -(price * quantity)
                }
            },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json(ApiResponse.error(
                404, 
                "Cart or product not found", 
                ["Cart or product does not exist"])
            );
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            "Product removed",
            cart
        ));

    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500,
            "Error removing product",
            [err.message]
        ));
    }
}

const deleteCart = async(req,res)=>{
    try{

        const {id} = req.params;

        const cart = await Cart.findByIdAndDelete(id);

        return res.status(200).json(ApiResponse.succes(
            200,
            "Cart deleted",
            cart
        ));

    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500,
            "Error deleting cart",
            [err.message]
        ));
    }
}

const getCart = async(req,res)=>{
    try{

        const {id} = req.params;

        const cart = await Cart.findById(id).lean();

        return res.status(200).json(ApiResponse.succes(
            200,
            "Cart record",
            cart
        ));

    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving cart",
            [err.message]
        ));
    }
}


module.exports = {
    save,
    addProduct,
    addQuantity,
    removeProduct,
    deleteCart,
    getCart
};