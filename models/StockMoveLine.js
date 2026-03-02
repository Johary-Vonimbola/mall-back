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
        type: String
    },
    productUomId: {
        type: mongoose.Types.ObjectId,
        ref: 'uom'
    },
    productPicture: {
        type: String
    },
    productCategory: {
        type: String
    },
    productCategoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'product_category'
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