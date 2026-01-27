const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

module.exports = app;