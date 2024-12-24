const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Add to cart
router.post('/add', async (req, res) => {
    const productId = req.body.productId;
    const cart = req.session.cart || {};

    cart[productId] = (cart[productId] || 0) + 1;
    req.session.cart = cart;

    res.redirect('back');
});

// View cart
router.get('/', async (req, res) => {
    console.log("Cart page accessed"); // Debugging log
    const cart = req.session.cart || {};
    const cartItems = [];
    let total = 0;

    for (const [productId, quantity] of Object.entries(cart)) {
        const product = await Product.findById(productId);
        if (product) {
            cartItems.push({
                product,
                quantity,
                subtotal: product.price * quantity
            });
            total += product.price * quantity;
        }
    }
    console.log("Cart Items:", cartItems);
    console.log("Total:", total);
    res.render('cart', { cartItems, total });
});
// Remove from cart
router.post('/remove', (req, res) => {
    const productId = req.body.productId;
    const cart = req.session.cart || {};

    if (cart[productId]) {
        delete cart[productId];
        req.session.cart = cart;
    }

    res.redirect('/cart');
});

module.exports = router;