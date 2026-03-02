const ShopRentPayment = require("../models/ShopRentPayment");
const ApiResponse = require("../utils/ApiResponse");

const getRentsByYear = async (req, res) => {
    try{
        const { shopId, year } = req.params; 
        if(!year){
            return res.status(400).json(ApiResponse.error(
                400,
                'Error when retrieving rents',
                ['No year provided']
            ));
        };
        const rents = await ShopRentPayment.find({ shopId, year }).populate('shopId').sort({ month: 1 });

        return res.status(200).json(ApiResponse.succes(
            200,
            'Rents record(s)',
            rents
        ));
    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500,
            'Error when retrieving rents',
            [err.message]
        ));
    }
};

const update = async (req, res) => {
    try {
        const { rentId } = req.params;

        if (!rentId) {
            return res.status(400).json(ApiResponse.error(
                400,
                "Error when updating rent",
                ["No rentId provided"]
            ));
        }
        if (!req.body) {
            return res.status(400).json(ApiResponse.error(
                400,
                "Error when updating rent",
                ["No body provided"]
            ));
        }

        const payment = await ShopRentPayment.findById(rentId);

        if (!payment) {
            return res.status(404).json(ApiResponse.error(
                404,
                "Error when paying rent",
                ["Payment not found"]
            ));
        }

        if (payment.status === "PAID") {
            return res.status(400).json(ApiResponse.error(
                400,
                "Error when paying rent",
                ["Rent already paid"]
            ));
        }

        const result = await ShopRentPayment.findByIdAndUpdate(rentId, {...req.body, paidAt: new Date() }, {new: true});

        return res.status(200).json(ApiResponse.succes(
            200,
            "Rent paid successfully",
            result
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error when paying rent",
            [err.message]
        ));
    }
};


const createRentPayment = async (req, res) => {
    try {
        const { shopId, month, year } = req.body;

        if (!shopId) {
            return res.status(400).json(ApiResponse.error(
                400,
                "Error when creating rent payment",
                ["No shopId provided"]
            ));
        }

        const currentDate = new Date();
        const selectedMonth = month || currentDate.getMonth() + 1;
        const selectedYear = year || currentDate.getFullYear();

        if (selectedMonth < 1 || selectedMonth > 12) {
            return res.status(400).json(ApiResponse.error(
                400,
                "Error when creating rent payment",
                ["Invalid month value"]
            ));
        }

        const rentConfig = await ShopRent.findOne({
            shopId,
            isActive: true
        });

        if (!rentConfig) {
            return res.status(404).json(ApiResponse.error(
                404,
                "Error when creating rent payment",
                ["Active rent configuration not found"]
            ));
        }

        const existingPayment = await ShopRentPayment.findOne({
            shopId,
            month: selectedMonth,
            year: selectedYear
        });

        if (existingPayment) {
            return res.status(400).json(ApiResponse.error(
                400,
                "Error when creating rent payment",
                ["Rent already paid for this period"]
            ));
        }

        const payment = await ShopRentPayment.create({
            shopId,
            rentConfigId: rentConfig._id,
            month: selectedMonth,
            year: selectedYear,
            amount: rentConfig.amount,
            paidBy: req.user?._id
        });

        return res.status(201).json(ApiResponse.succes(
            201,
            "Rent payment created successfully",
            payment
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            "Error when creating rent payment",
            [err.message]
        ));
    }
};

const getAll = async (req, res) => {
    try{
        const rentPayments = await ShopRentPayment.find().populate("shopId");
        return res.status(200).json(ApiResponse.succes(
            200,
            "Shop rent payments record(s)",
            rentPayments
        ));
    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500,
            "Error when retrieving the rent payments",
            [err.message]
        ));
    }
}

module.exports = {
    getRentsByYear,
    update,
    createRentPayment,
    getAll
};