const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const protect = require('../middleware/auth');

const pool = require('../config/db');

// Create Checkout Session
router.post('/create-checkout-session', protect, async (req, res) => {
    try {
        const { amount, planName } = req.body;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ message: "Invalid amount provided" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${planName} Plan`,
                            description: `Subscription for ${planName} Plan on Collab-Tool`,
                        },
                        unit_amount: Math.round(amount * 100), // amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?payment=success`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing?payment=cancelled`,
            customer_email: req.user.email,
            metadata: {
                userId: req.user.id,
                plan: planName
            }
        });

        // Log order in DB
        await pool.execute(
            'INSERT INTO orders (user_id, plan_name, amount, stripe_session_id, status) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, planName, amount, session.id, 'pending']
        );

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ 
            message: "Error creating Stripe session", 
            error: error.message 
        });
    }
});

// Webhook for Stripe events (Optional but recommended for production)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Update order status
        await pool.execute(
            'UPDATE orders SET status = ?, stripe_payment_intent = ? WHERE stripe_session_id = ?',
            ['completed', session.payment_intent, session.id]
        );
        // Update user subscription
        if (session.metadata && session.metadata.userId && session.metadata.plan) {
            await pool.execute(
                'UPDATE users SET plan = ?, subscription_status = ? WHERE id = ?',
                [session.metadata.plan, 'active', session.metadata.userId]
            );
        }
        console.log('Payment successful for session:', session.id);
    }

    res.json({received: true});
});

module.exports = router;
