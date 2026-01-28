const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    }
}, { timestamps: true });

const RefreshToken = mongoose.model("refresh_token", tokenSchema);
module.exports = RefreshToken;