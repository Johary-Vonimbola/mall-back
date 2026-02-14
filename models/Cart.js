const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    date : {
        type: Date,
        required: true
    },
    clientId : {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    shopId : {
        type: mongoose.Types.ObjectId,
        ref: 'shop',
        required: true
    },
    total : {
        type: Number,
        required: true,
        default: 0
    },
    nbArticles : {
        type: Number,
        required: true,
        default: 0
    },
    details: [
        {
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
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;