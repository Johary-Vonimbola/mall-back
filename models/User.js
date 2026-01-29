const mongoose = require('mongoose');
const { ROLE, ROLE_ENUM } = require('../data/Role');

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
        enum: ROLE_ENUM,
        default: ROLE.CLIENT,
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