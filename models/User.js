const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["MALL_ADMIN", "SHOP_ADMIN", "CLIENT"],
        default: "CLIENT",
        required: true
    },
    picture: {
        type: String
    }
},{
    timestamps: true
});

const User = mongoose.model("user", userSchema);
module.exports = User;