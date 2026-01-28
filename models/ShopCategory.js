const mongoose = require('mongoose');
const shopCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true});

const ShopCategory = mongoose.model('shop_category', shopCategorySchema);

module.exports = ShopCategory;