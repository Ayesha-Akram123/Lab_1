const express = require('express');
const router = express.Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const Product = require('../models/product');


router.post('/add', ensureAuthenticated, async (req, res) => {
    const productId = req.body.productId;
    const cart = req.session.cart || {};

    cart[productId] = (cart[productId] || 0) + 1;
    req.session.cart = cart;

    res.redirect('back');
});


router.get('/', ensureAuthenticated, async (req, res) => {
    ;
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

    res.render('cart', { cartItems, total });
});

router.post('/remove', ensureAuthenticated, (req, res) => {
    const productId = req.body.productId;
    const cart = req.session.cart || {};

    if (cart[productId]) {
        delete cart[productId];
        req.session.cart = cart;
    }

    res.redirect('/cart');
});

module.exports = router;