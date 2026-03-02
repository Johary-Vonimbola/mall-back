const mongoose = require('mongoose');

const stockMoveLineSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: 'stock_move',
        required: true
    },
    type: {
        type: String,
        enum: ['IN', 'OUT'],
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true
    },
    productName: {
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
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const StockMoveLine = mongoose.model('stock_move_line', stockMoveLineSchema);
module.exports = StockMoveLine;