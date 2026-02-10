const Status = require('../models/Status');
const ApiResponse = require('../utils/ApiResponse');

const getAll = async (req, res) => {
    try {
        const statusList = await Status.find();

        return res.status(200).json(ApiResponse.succes(
            200,
            "Status record(s)",
            statusList
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error for fetching status list",
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
                'Error fecthing status',
                ['No id provided']
            ));
        }

        const status = await Status.findById(id);

        if (!status) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Status not found',
                ['Status does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            `Status ${id} record`,
            status
        ));
    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving status",
            [err.message]
        ));
    }
};

const save = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating status',
                ['No information provided']
            ));
        }

        const status = new Status(req.body);
        await status.save();

        return res.status(201).json(ApiResponse.succes(
            201,
            'Status created',
            status
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error creating status',
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
                'Error updating status',
                ['No id provided']
            ));
        }

        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating status',
                ['No information provided']
            ));
        }

        const status = await Status.findByIdAndUpdate(id, req.body, { new: true });

        if (!status) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Status not found',
                ['Status does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Status updated',
            status
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating status',
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
                'Error deleting status',
                ['No id provided']
            ));
        }

        const deletedStatus = await Status.findByIdAndDelete(id);

        if (!deletedStatus) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Status not found',
                ['Status does not exist']
            ));
        }

        return res.status(200).json(ApiResponse.succes(
            200,
            'Status deleted',
            deletedStatus
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deleting status',
            [err.message]
        ));
    }
};

module.exports.save = save;
module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.update = update;
module.exports.remove = remove;