const ApiResponse = require('../utils/ApiResponse');
const ShopRent = require('../models/ShopRent');
const { FREQUENCY_ENUM, FREQUENCY_MAP } = require('../data/RentFrequency');
const ShopRentPayment = require('../models/ShopRentPayment');
const { default: mongoose } = require('mongoose');


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
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error creating shop rent',
                ['No information provided']
            ));
        }

        const shopId = req.body.shopId;
        const frequency = FREQUENCY_MAP[req.body.frequencyString];
        if(!frequency){
            session.abortTransaction();
            return res.status(500).json(ApiResponse.error(
                500,
                'Error creating shop rent',
                ['Unknown frequency']
            ));
        }

        await ShopRent.updateMany(
            { shopId },
            { isActive: false },
            { session }
        );

        const shopRent = new ShopRent({...req.body, frequency: frequency});
        await shopRent.save({session});

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        
        const payments = [];
        let currentDate = new Date(startDate);
        while(currentDate < endDate){
            payments.push({
                shopId: req.body.shopId,
                rentConfigId: shopRent._id,
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1,
                amount: 0,
                paidAt: null,
                status: "UNPAID"
            });
            currentDate.setMonth(currentDate.getMonth() + frequency);
        }
        await ShopRentPayment.insertMany(payments, {session});

        session.commitTransaction();
        return res.status(201).json(ApiResponse.succes(
            201,
            'Shop rent created',
            shopRent
        ));

    } catch (err) {
        session.abortTransaction();
        return res.status(500).json(ApiResponse.error(
            500,
            'Error creating shop rent',
            [err.message]
        ));
    } finally {
        session.endSession();
    }
};

const updateShopRent = async (id, data, session) => {
    try{
        return await ShopRent.findByIdAndUpdate(id, data, { new: true }).session(session)
    }catch(err){
        session.abortTransaction();
        throw err;
    }
};


const update = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;

        if (!id) {
            session.abortTransaction();
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating shop rent',
                ['No id provided']
            ));
        }

        if (!req.body) {
            session.abortTransaction();
            return res.status(400).json(ApiResponse.error(
                400,
                'Error updating shop rent',
                ['No information provided']
            ));
        }

        const shopRent = await updateShopRent(id, req.body, session);

        if (!shopRent) {
            session.abortTransaction();
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop rent not found',
                ['Shop rent does not exist']
            ));
        }
        if(shopRent.isActive){
            const frequency = FREQUENCY_MAP[shopRent.frequencyString];

            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;

            await ShopRentPayment.deleteMany({
                rentConfigId: shopRent._id,
                $or: [
                    { year: { $gt: currentYear } },
                    { year: currentYear, month: { $gte: currentMonth + 1 } }
                ]
            }).session(session);
            let current = new Date(currentYear, currentMonth + frequency - 1, 1);
            const endDate = new Date(currentYear + 1, currentMonth - 1, 1);

            const payments = [];
            while (current <= endDate) {
                payments.push({
                    shopId: shopRent.shopId,
                    rentConfigId: shopRent._id,
                    year: current.getFullYear(),
                    month: current.getMonth() + 1,
                    amount: shopRent.amount,
                    status: "UNPAID",
                    paidAt: null
                });

                current.setMonth(current.getMonth() + frequency);
            }
            if (payments.length > 0) {
                await ShopRentPayment.insertMany(payments, { session });
            }
        }
        session.commitTransaction();
        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop rent updated',
            shopRent
        ));

    } catch (err) {
        session.abortTransaction();
        return res.status(500).json(ApiResponse.error(
            500,
            'Error updating shop rent',
            [err.message]
        ));
    } finally {
        session.endSession();
    }
};

const deactivate = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Error deactivating shop rent',
                ['No id provided']
            ));
        }

        const shopRent = await updateShopRent(id, { isActive: false }, session);

        if (!shopRent) {
            session.abortTransaction();
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop rent not found',
                ['Shop rent does not exist']
            ));
        }

        session.commitTransaction();
        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop rent deactivated',
            shopRent
        ));

    } catch (err) {
        session.abortTransaction();
        return res.status(500).json(ApiResponse.error(
            500,
            'Error deactivating shop rent',
            [err.message]
        ));
    }finally{
        session.endSession();
    }
};

const activate = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;

        if (!id) {
            session.abortTransaction();
            return res.status(400).json(ApiResponse.error(
                400,
                'Error activating shop rent',
                ['No id provided']
            ));
        }

        const shopRent = await updateShopRent(id, { isActive: true }, session);
        await ShopRent.updateMany({ _id:  {$ne: shopRent._id}}, {$set: {isActive: false}}).session(session);

        if (!shopRent) {
            session.abortTransaction();
            return res.status(404).json(ApiResponse.error(
                404,
                'Shop rent not found',
                ['Shop rent does not exist']
            ));
        }
        session.commitTransaction();
        return res.status(200).json(ApiResponse.succes(
            200,
            'Shop rent activated',
            shopRent
        ));

    } catch (err) {
        session.abortTransaction();
        return res.status(500).json(ApiResponse.error(
            500,
            'Error activating shop rent',
            [err.message]
        ));
    } finally{
        session.endSession();
    }
};

module.exports = {
    getAll, save, update, getAllFrequencies, deactivate, activate,
    getById
};