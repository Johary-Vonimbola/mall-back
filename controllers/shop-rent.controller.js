const ApiResponse = require('../utils/ApiResponse');
const ShopRent = require('../models/ShopRent');
const { FREQUENCY_ENUM, FREQUENCY_MAP } = require('../data/RentFrequency');


const getAll = async (req, res) => {
    try {
        const shopRents = await ShopRent.find();
        return res.status(200).json(ApiResponse.succes(
            200,
            "Shop rent record(s)",
            shopRents
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving shop rents",
            [err.message]
        ));
    }
};


const getById = async (req, res) => {
    try {
        if(!req.params.id){
            return res.status(500).json(ApiResponse.error(
                500,
                'Error retrieving shop rent',
                ['No id provided']
            ));
        };
        const id = req.params.id;
        const result = await ShopRent.findById(id);
        return res.status(200).json(ApiResponse.succes(
            200,
            "Shop rent record(s)",
            result
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving shop rent",
            [err.message]
        ));
    }
};

const getAllFrequencies = async (req, res) => {
    try {
        return res.status(200).json(ApiResponse.succes(
            200,
            "Shop rent frequencies record(s)",
            FREQUENCY_ENUM
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving shop rents frequencies",
            [err.message]
        ));
    }
};

const save = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating shop rent',
                ['No information provided']
            ));
        }

        const frequency = FREQUENCY_MAP[req.body.frequencyString];
        if(!frequency){
            return res.status(500).json(ApiResponse.error(
                500,
                'Error creating shop rent',
                ['Unknown frequency']
            ));
        }

        const shopRent = new ShopRent({...req.body, frequency: frequency});
        await shopRent.save();

        return res.status(201).json(ApiResponse.succes(
            201,
            'Shop rent created',
            shopRent
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error creating shop rent',
            [err.message]
        ));
    }
};

const updateShopRent = async (id, data) => {
    return await ShopRent.findByIdAndUpdate(id, data, { new: true })
};


const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating shop rent',
                ['No id provided']
            ));
        }

        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating shop rent',
                ['No information provided']
            ));
        }

        const shopRent = updateShopRent(id, req.body);

        if (!shopRent) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop rent not found',
                ['Shop rent does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop rent updated',
            shopRent
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating shop rent',
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
                'Error deactivating shop rent',
                ['No id provided']
            ));
        }

        const shopRent = await updateShopRent(id, { isActive: false });

        if (!shopRent) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop rent not found',
                ['Shop rent does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop rent deactivated',
            shopRent
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deactivating shop rent',
            [err.message]
        ));
    }
};

const activate = async(req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error activating shop rent',
                ['No id provided']
            ));
        }

        const shopRent = await updateShopRent(id, { isActive: true });

        if (!shopRent) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop rent not found',
                ['Shop rent does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop rent activated',
            shopRent
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error activating shop rent',
            [err.message]
        ));
    }
};

module.exports = {
    getAll, save, update, getAllFrequencies, deactivate, activate,
    getById
};