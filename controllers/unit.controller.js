const Unit = require('../models/Unit');
const ApiResponse = require('../utils/ApiResponse');

const getAll = async (req, res) => {
    try {
        const units = await Unit.find();

        return res.status(200).json(ApiResponse.succes(
            200,
            "Units record(s)",
            units
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error for fetching units list",
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
                'Error fecthing unit',
                ['No id provided']
            ));
        }

        const unit = await Unit.findById(id);

        if (!unit) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Unit not found',
                ['Unit does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            `Unit ${id} record`,
            unit
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving units",
            [err.message]
        ));
    }
};

const save = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating unit',
                ['No information provided']
            ));
        }

        const unit = new Unit(req.body);
        await unit.save();

        return res.status(201).json(ApiResponse.succes(
            201,
            'Unit created',
            unit
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error creating unit',
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
                'Error updating unit',
                ['No id provided']
            ));
        }

        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating unit',
                ['No information provided']
            ));
        }

        const unit = await Unit.findByIdAndUpdate(id, req.body, { new: true });

        if (!unit) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Unit not found',
                ['Unit does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Unit updated',
            unit
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating unit',
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
                'Error deleting unit',
                ['No id provided']
            ));
        }

        const deletedUnit = await Unit.findByIdAndDelete(id);

        if (!deletedUnit) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Unit not found',
                ['Unit does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Unit deleted',
            deletedUnit
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deleting unit',
            [err.message]
        ));
    }
};

module.exports.save = save;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.update = update;
module.exports.remove = remove;