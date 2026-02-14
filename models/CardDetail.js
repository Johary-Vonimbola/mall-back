const mongoose = require('mongoose');

const cardDetailSchema = new mongoose.Schema({
    cardId: {
        type: mongoose.Types.ObjectId,
        ref: 'card',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true
    },
    productName: 
    {
        type: String,
        required: true
    },
    productUom: {
        type: String,
        required: true
    },
    productUomId: {
        type: mongoose.Types.ObjectId,
        ref: 'uom',
        required: true
    },
    productPicture: {
        type: String
    },
    productCategory: {
        type: String,
        required: true
    },
    productCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'product_category',
        required: true
    }
}, { timestamps: true });

const CardDetail = mongoose.model('card_detail', cardDetailSchema);

module.exports = CardDetail;