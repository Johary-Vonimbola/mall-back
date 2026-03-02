const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ApiResponse = require('../utils/ApiResponse');
const { updateProductAndSync } = require('./product.controller');

const getAll = async (req, res) => {
    try {
        const { shopId } = req.params;

        const productCategories = await ProductCategory.find({
            shopId: shopId
        });

        return res.status(200).json(ApiResponse.succes(
            200,
            'Product Categories record(s)',
            productCategories
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving Product Categories',
            [err.message]
        ));
    }
};


const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error fetching Product Category',
                ['No id provided']
            ));
        }

        const productCategory = await ProductCategory.findById(id);

        if (!productCategory) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product Category not found',
                ['Product Category does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            `Product Category ${id} record`,
            productCategory
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving Product Categories',
            [err.message]
        ));
    }
};


const save = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating Product Category',
                ['No information provided']
            ));
        }

        const productCategory = new ProductCategory(req.body);
        await productCategory.save();

        return res.status(201).json(ApiResponse.succes(
            201,
            'Product Category created',
            productCategory
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error creating Product Category',
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
                'Error updating Product Category',
                ['No id provided']
            ));
        }

        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating Product Category',
                ['No information provided']
            ));
        }

        const productCategory = await ProductCategory.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        const products = await Product.find({
            categoryId: id
        });

        for (let i = 0; i < products.length; i++) {
            const data = products[i].toObject();

            data.category = productCategory.name;
            data.categoryId = productCategory._id;

            await updateProductAndSync(products[i]._id, data);
        }

        if (!productCategory) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product Category not found',
                ['Product Category does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Product Category updated',
            productCategory
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating Product Category',
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
                'Error deleting Product Category',
                ['No id provided']
            ));
        }

        const productByCategory = await Product.find({
            categoryId: id
        });

        if (productByCategory.length > 0) {
            return res.status(301).json(ApiResponse.error(
                301,
                'Product Category can not deleted',
                ['Product Category exist in other collections (Product)']
            ));
        }

        const deletedproductCategory = await ProductCategory.findByIdAndDelete(id);

        if (!deletedproductCategory) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Product Category not found',
                ['Product Category does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Product Category deleted',
            deletedproductCategory
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deleting Product Category',
            [err.message]
        ));
    }
};


module.exports.save = save;
module.exports.getById = getById;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.remove = remove;