const Shop = require('../models/Shop');
const User = require('../models/User');
const ShopRentPayment = require('../models/ShopRentPayment');
const ApiResponse = require('../utils/ApiResponse');

const getDashboard = async (req, res) => {
    try {

        const { year } = req.query;

        const selectedYear = year ? parseInt(year) : new Date().getFullYear();
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const totalShops = await Shop.countDocuments();
        const activeShops = await Shop.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments();

        const monthlyData = await ShopRentPayment.aggregate([
            {
                $match: { year: selectedYear }
            },
            {
                $group: {
                    _id: "$month",
                    totalPaid: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "PAID"] }, "$amount", 0]
                        }
                    },
                    totalUnpaid: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "UNPAID"] }, "$amount", 0]
                        }
                    }
                }
            }
        ]);

        const monthlyRent = [];

        for (let m = 1; m <= 12; m++) {
            const found = monthlyData.find(d => d._id === m);
            monthlyRent.push({
                month: m,
                paid: found ? found.totalPaid : 0,
                unpaid: found ? found.totalUnpaid : 0
            });
        }

        const shopSummary = await ShopRentPayment.aggregate([
            {
                $lookup: {
                    from: "shops",
                    localField: "shopId",
                    foreignField: "_id",
                    as: "shop"
                }
            },
            { $unwind: "$shop" },
            {
                $group: {
                    _id: "$shopId",
                    shopName: { $first: "$shop.name" },
                    totalPaid: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "PAID"] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    totalUnpaid: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$status", "UNPAID"] },
                                        {
                                            $or: [
                                                { $lt: ["$year", currentYear] },
                                                {
                                                    $and: [
                                                        { $eq: ["$year", currentYear] },
                                                        { $lt: ["$month", currentMonth] }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    shopId: "$_id",
                    shopName: 1,
                    totalPaid: 1,
                    totalUnpaid: 1,
                    _id: 0
                }
            }
        ]);

        return res.status(200).json(
            ApiResponse.succes(
                200,
                "Admin dashboard data",
                {
                    stats: {
                        totalShops,
                        activeShops,
                        totalUsers
                    },
                    monthlyRent,
                    shopSummary
                }
            )
        );

    } catch (err) {
        return res.status(500).json(
            ApiResponse.error(
                500,
                "Error retrieving dashboard",
                [err.message]
            )
        );
    }
};

module.exports = {
    getDashboard
};