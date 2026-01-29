const mongoose = require('mongoose');
const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
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

const Shop = mongoose.model('shop', shopSchema);

module.exports = Shop;