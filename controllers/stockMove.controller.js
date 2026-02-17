const { default: mongoose } = require('mongoose');
const Product = require('../models/Product');
const StockMove = require('../models/StockMove');
const StockMoveLine = require('../models/StockMoveLine');
const ApiResponse = require('../utils/ApiResponse');

const updateStockProduct = async (productId, quantity, type) => {
    if(type === 'OUT') quantity *= -1;
    await Product.findByIdAndUpdate(productId, {
        $inc: { stock: quantity }
    }, { new: true });
}

const saveStockMove = async (date, shopId, description='', lines) => {
    const stockMove = new StockMove({ shopId, date, description });
    await stockMove.save();

    lines.forEach(line => {
        line.parentId = stockMove._id;
    });

    await StockMoveLine.insertMany(lines);

    lines.forEach(async line => {
        await updateStockProduct(line.productId, line.quantity, line.type);
    });
    return stockMove;
}

const save = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        if(!req.body){
            session.abortTransaction();
            return res.status(500).json(ApiResponse.error(
                500,
                'Error when saving the stock move',
                ['No body provided']
            ));
        }
        const { date, shopId, lines, description='' } = req.body;

        const stockMove = await saveStockMove(date, shopId, description, lines);

        session.commitTransaction();
        return res.status(200).json(ApiResponse.succes(
            200,
            'Stock move created successfully',
            {
                parent: stockMove,
                lines: lines
            }
        ));
    }catch(err){
        session.abortTransaction();
        return res.status(500).json(ApiResponse.error(
            500,
            'Error when saving the stock move',
            [err.message]
        ));
    }finally{
        session.endSession();
    }

};

const getStockMoves = async (req, res) => {
    try {
        const { shopId } = req.params;

        if (!shopId) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error fetching stock moves',
                ['No shopId provided']
            ));
        }

        const stockMoves = await StockMove.find({
            shopId: shopId
        }).sort({ date: -1 });

        return res.status(200).json(ApiResponse.succes(
            200,
            'Stock move record(s)',
            stockMoves
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving stock moves',
            [err.message]
        ));
    }
};

const getStockMoveLines = async (req, res) => {
    try {
        const { parentId } = req.params;

        if (!parentId) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error fetching stock move lines',
                ['No parentId provided']
            ));
        }

        const stockMoveLines = await StockMoveLine.find({
            parentId: parentId
        }).sort({ createdAt: -1 });

        return res.status(200).json(ApiResponse.succes(
            200,
            'Stock move line record(s)',
            stockMoveLines
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving stock move lines',
            [err.message]
        ));
    }
};

const getStockMoveLinesByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error fetching stock move lines',
                ['No productId provided']
            ));
        }

        const stockMoveLines = await StockMoveLine.find({
            productId: productId
        }).sort({ createdAt: -1 });

        return res.status(200).json(ApiResponse.succes(
            200,
            'Stock move line record(s) by product',
            stockMoveLines
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving stock move lines',
            [err.message]
        ));
    }
};

const configThreshold = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error configuring thesholds',
                ['No information provided']
            ));
        }

        const thresholds = req.body;
        const results = [];
        for(let t of thresholds){
            const product = await Product.findByIdAndUpdate(t.productId, { stockThreshold: t.threshold }, { new: true });

            if (!product) {
                session.abortTransaction();
                return res.status(404).json(ApiResponse.error(
                    404,
                    'Product not found',
                    ['Product does not exist']
                ));
            }
            results.push(product);
        }

        session.commitTransaction();
        return res.status(200).json(ApiResponse.succes(
            200,
            'Thresholds configuration done',
            results
        ));

    } catch (err) {
        session.abortTransaction();
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating product',
            [err.message]
        ));
    } finally {
        session.endSession();
    }
}


module.exports = {
    save,
    getStockMoves,
    getStockMoveLines,
    getStockMoveLinesByProduct,
    configThreshold,
    saveStockMove
};