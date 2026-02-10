const mongoose = require('mongoose');

const { FREQUENCY_ENUM } = require('../data/RentFrequency');

const shopRentSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop',
        required: true
    },
    shopName: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    frequencyString: {
        type: String,
        enum: FREQUENCY_ENUM,
        required: true
    },
    frequency: {
        type: Number,
        required: true,
        default: 1
    },
    dueDate: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const shopRent = mongoose.model('shop_rent', shopRentSchema);
module.exports = shopRent;