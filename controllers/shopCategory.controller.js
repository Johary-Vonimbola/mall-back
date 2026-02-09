const ShopCategory = require('../models/ShopCategory');
const ApiResponse = require('../utils/ApiResponse');

const getAll = async (req, res) => {
    try {
        const shopCategories = await ShopCategory.find();

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop Categories record(s)',
            shopCategories
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving Shop Categories',
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
                'Error fetching Shop Category',
                ['No id provided']
            ));
        }

        const shopCategory = await ShopCategory.findById(id);

        if (!shopCategory) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop Category not found',
                ['Shop Category does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            `Shop Category ${id} record`,
            shopCategory
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error retrieving Shop Categories',
            [err.message]
        ));
    }
};


const save = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating Shop Category',
                ['No information provided']
            ));
        }

        const shopCategory = new ShopCategory(req.body);
        await shopCategory.save();

        return res.status(201).json(ApiResponse.succes(
            201,
            'Shop Category created',
            shopCategory
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error creating Shop Category',
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
                'Error updating Shop Category',
                ['No id provided']
            ));
        }

        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating Shop Category',
                ['No information provided']
            ));
        }

        const shopCategory = await ShopCategory.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!shopCategory) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop Category not found',
                ['Shop Category does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop Category updated',
            shopCategory
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating Shop Category',
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
                'Error deleting Shop Category',
                ['No id provided']
            ));
        }

        const deletedShopCategory = await ShopCategory.findByIdAndDelete(id);

        if (!deletedShopCategory) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop Category not found',
                ['Shop Category does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop Category deleted',
            deletedShopCategory
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deleting Shop Category',
            [err.message]
        ));
    }
};


module.exports.save = save;
module.exports.getById = getById;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.remove = remove;