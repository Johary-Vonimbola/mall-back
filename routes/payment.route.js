const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/:orderId', paymentController.createPaymentIntent);

module.exports = router;
