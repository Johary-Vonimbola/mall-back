const ApiResponse = require('../utils/ApiResponse');
const ShopRent = require('../models/ShopRent');


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

const save = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating shop rent',
                ['No information provided']
            ));
        }

        const shopRent = new ShopRent(req.body);
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

        const shopRent = await ShopRent.findByIdAndUpdate(id, req.body, { new: true });

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

module.exports = {
    getAll, save, update
};