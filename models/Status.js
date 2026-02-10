const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    order:{
        type: Number,
        required: true
    }
}, { timestamps: true });

const Status = mongoose.model('status', statusSchema);

module.exports = Status;