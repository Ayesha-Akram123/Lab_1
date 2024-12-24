const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res) => {
    res.render('checkout');
});

router.post('/', async (req, res) => {
    const cart = req.session.cart || {};
    const { name, address, phone } = req.body;

    try {
        const orderItems = [];
        let total = 0;

        for (const [productId, quantity] of Object.entries(cart)) {
            const product = await Product.findById(productId);
            if (product) {
                orderItems.push({
                    product: productId,
                    quantity,
                    price: product.price
                });
                total += product.price * quantity;
            }
        }

        const order = new Order({
            user: req.user ? req.user._id : null,
            items: orderItems,
            total,
            name,
            address,
            phone,
            paymentMethod: 'cash'
        });

        await order.save();

        // Clear the cart
        req.session.cart = {};

        res.redirect('/checkout/success');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during checkout');
    }
});

router.get('/success', (req, res) => {
    res.render('checkout-success');
});

module.exports = router;