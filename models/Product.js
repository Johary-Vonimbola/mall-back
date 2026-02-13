const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    uom: {
        type: String,
        required: true
    },
    uomId: {
        type: mongoose.Types.ObjectId,
        ref: 'uom',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'shop',
        required: true
    },
    picture: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'product_category',
        required: true
    },
    stock: {
        type: Number,
        default: 0
    }
}, { timestamps: true});

const Product = mongoose.model('product', productSchema);

module.exports = Product;