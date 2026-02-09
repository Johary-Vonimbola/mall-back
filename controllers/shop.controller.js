const Shop = require('../models/Shop');
const ApiResponse = require('../utils/ApiResponse');
const { PathLogoShop } = require('../data/PathUpload');

const getAll = async (req, res) => {
    try {
        const shops = await Shop.find();
        return res.status(200).json(ApiResponse.succes(
            200,
            "Shop record(s)",
            shops
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving shops",
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
                'Error fecthing shop',
                ['No id provided']
            ));
        }

        const shop = await Shop.findById(id);

        if (!shop) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop not found',
                ['Shop does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            `Shop ${id} record`,
            shop
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving shops",
            [err.message]
        ));
    }
};

const save = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating shop',
                ['No information provided']
            ));
        }

        const shop = new Shop(req.body);
        await shop.save();

        return res.status(201).json(ApiResponse.succes(
            201,
            'Shop created',
            shop
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error creating shop',
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
                'Error updating shop',
                ['No id provided']
            ));
        }

        const updateData = { ...req.body };

        if (req.file) {
            updateData.logo = `${PathLogoShop}/${req.file.filename}`;
        }

        const shop = await Shop.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!shop) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop not found',
                ['Shop does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop updated',
            shop
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating shop',
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
                'Error updating shop',
                ['No id provided']
            ));
        }

        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating shop',
                ['No information provided']
            ));
        }

        const shop = await Shop.findByIdAndUpdate(id, req.body, { new: true });

        if (!shop) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop not found',
                ['Shop does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop updated',
            shop
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating shop',
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
                'Error deleting shop',
                ['No id provided']
            ));
        }

        const deletedShop = await Shop.findByIdAndDelete(id);

        if (!deletedShop) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop not found',
                ['Shop does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop deleted',
            deletedShop
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deleting shop',
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
                ['No shop id provided']
            ));
        }

        const shop = await Shop.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );

        if (!shop) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop not found',
                ['Shop does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop activated successfully',
            shop
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error activating shop',
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
                ['No shop id provided']
            ));
        }

        const shop = await Shop.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!shop) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop not found',
                ['Shop does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop deactivated successfully',
            shop
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deactivating shop',
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