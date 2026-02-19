const mongoose = require('mongoose');

const shopRentPaymentSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop',
        required: true
    },
    rentConfigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop_rent',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paidAt: {
        type: Date,
        default: Date.now
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: String,
        enum: ["PAID", "UNPAID"],
        default: "PAID"
    }
}, {
    timestamps: true
});

shopRentPaymentSchema.index({ shopId: 1, year: 1, month: 1, rentConfigId: 1 }, { unique: true });

module.exports = mongoose.model('shop_rent_payment', shopRentPaymentSchema);
