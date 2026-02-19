const express = require('express');
const router = require('./routes/route');
const cors = require('cors');
const mongoose = require('mongoose');
const webhookRouter = require('./routes/webhook.route');

const app = express();

app.use(webhookRouter);

app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(router);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('------------------MongoDB connected-----------------'))
.catch(err => console.error(err.message));

module.exports = app;