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
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    shopId: {
        type: String,
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
        type: String,
        required: true
    }
}, { timestamps: true});

const Product = mongoose.model('product', productSchema);

module.exports = Product;