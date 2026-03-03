const express = require('express');
const router = require('./routes/route');
const cors = require('cors');
const webhookRouter = require('./routes/webhook.route');

const app = express();

app.use(webhookRouter);

app.use(cors({
    origin: "*"
}));
app.use(express.json());

// app.use('/uploads', express.static('uploads'));

app.use(router);

module.exports = app;