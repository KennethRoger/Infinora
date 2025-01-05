const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: 'receipt_' + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating Razorpay order',
            error: error.message,
        });
    }
};

// Verify Razorpay Payment
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update order with payment details
            await Order.findByIdAndUpdate(
                orderId,
                {
                    'razorpay.orderId': razorpay_order_id,
                    'razorpay.paymentId': razorpay_payment_id,
                    'razorpay.signature': razorpay_signature,
                    paymentStatus: 'completed',
                },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
            });
        } else {
            await Order.findByIdAndUpdate(
                orderId,
                {
                    paymentStatus: 'failed',
                },
                { new: true }
            );

            res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message,
        });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
};
