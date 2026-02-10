const mongoose = require('mongoose');

const productCategory = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },    
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'shop',
        // required: true
    }
}, { timestamps: true});

const ProductCategory = mongoose.model('product_category', productCategory);

module.exports = ProductCategory;