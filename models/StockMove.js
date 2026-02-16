const mongoose = require('mongoose');

const stockMoveSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'shop',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

const StockMove = mongoose.model('stock_move', stockMoveSchema);

module.exports = StockMove;