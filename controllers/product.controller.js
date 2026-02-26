const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');
const { PathPictureProduct } = require('../data/PathUpload');

const getAll = async (req, res) => {
    try {
        const { shopId } = req.params;

        const products = await Product.find({
            shopId : shopId
        });

        return res.status(200).json(ApiResponse.succes(
            200,
            "Product record(s)",
            products
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving products",
            [err.message]
        ));
    }
};

const getById = async (req, res) => {
    try {
        const { shopId , id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error fecthing product',
                ['No id provided']
            ));
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product not found',
                ['Product does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            `Product ${id} record`,
            product
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving products",
            [err.message]
        ));
    }
};

const save = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating product',
                ['No information provided']
            ));
        }
        const data = {...req.body, picture: req.file?.filename ?? ''}

        if (req.file) {
            data.picture = `${PathPictureProduct}/${req.file.filename}`;
        }

        const product = new Product(data);
        await product.save();

        return res.status(201).json(ApiResponse.succes(
            201,
            'Product created',
            product
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error creating product',
            [err.message]
        ));
    }
};


const upload = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating product',
                ['No id provided']
            ));
        }

        const updateData = { ...req.body };

        if (req.file) {
            updateData.picture = `${PathPictureProduct}/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product not found',
                ['Product does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Product updated',
            product
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating product',
            [err.message]
        ));
    }
};


const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating product',
                ['No id provided']
            ));
        }

        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating product',
                ['No information provided']
            ));
        }

        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!product) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product not found',
                ['Product does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Product updated',
            product
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating product',
            [err.message]
        ));
    }
};


const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error deleting product',
                ['No id provided']
            ));
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product not found',
                ['Product does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Product deleted',
            deletedProduct
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deleting product',
            [err.message]
        ));
    }
};


const activate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Activation failed',
                ['No product id provided']
            ));
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { 
                isActive: true
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product not found',
                ['Product does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Product activated successfully',
            product
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error activating product',
            [err.message]
        ));
    }
};


const deactivate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Deactivation failed',
                ['No product id provided']
            ));
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product not found',
                ['Product does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Product deactivated successfully',
            product
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deactivating product',
            [err.message]
        ));
    }
};


module.exports.save = save;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.update = update;
module.exports.upload = upload;
module.exports.remove = remove;
module.exports.activate = activate;
module.exports.deactivate = deactivate;