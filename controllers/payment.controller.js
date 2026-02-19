const Stripe = require('stripe');
const Order = require('../models/Order');
const { STATUS_ORDER } = require('../data/Status');
const ApiResponse = require('../utils/ApiResponse');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ==============================
// CREATE PAYMENT INTENT
// ==============================
const createPaymentIntent = async (req, res) => {
    try {

        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json(ApiResponse.error(
                404,
                'Order not found',
                []
            ));
        }

        if (order.status !== STATUS_ORDER.UNPAID) {
            return res.status(400).json(ApiResponse.error(
                400,
                'Order already paid',
                []
            ));
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.total * 100),
            currency: 'usd',
            metadata: {
                orderId: order._id.toString()
            }
        });

        return res.status(200).json(ApiResponse.succes(
            200,
            'PaymentIntent created',
            { clientSecret: paymentIntent.client_secret }
        ));

    } catch (err) {
        return res.status(500).json(ApiResponse.error(
            500,
            'Payment error',
            [err.message]
        ));
    }
};


// ==============================
// STRIPE WEBHOOK
// ==============================
const handleWebhook = async (req, res) => {    
    const sig = req.headers['stripe-signature'];

    let event;

    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (err) {

        console.log("❌ Webhook signature failed");
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    // 🎯 Payment Success
    if (event.type === 'payment_intent.succeeded') {

        const paymentIntent = event.data.object;

        const orderId = paymentIntent.metadata.orderId;

        await Order.findByIdAndUpdate(orderId, {
            status: STATUS_ORDER.IN_PROGRESS_DELIVERY
        });
    }

    res.json({ received: true });
};


module.exports = {
    createPaymentIntent,
    handleWebhook
};
