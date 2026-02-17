const mongoose = require('mongoose');

const { STATUS_ORDER_ENUM } = require('../data/Status');

const orderSchema = new mongoose.Schema({
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
    status : {
        type: String,
        enum: STATUS_ORDER_ENUM,
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model('order',orderSchema);

module.exports = Order;