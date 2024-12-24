const express = require("express");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const User = require("../models/user");
const Product = require("../models/product");

const router = express.Router();


router.post("/add", ensureAuthenticated, async (req, res) => {
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            req.flash("error_msg", "Product not found.");
            return res.redirect("back");
        }

        const user = await User.findById(req.user.id);

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
            req.flash("success_msg", "Product added to your wishlist!");
        } else {
            req.flash("info_msg", "Product is already in your wishlist.");
        }

        res.redirect("/wishlist");
    } catch (err) {
        req.flash("error_msg", "Failed to add product to wishlist.");
        res.redirect("back");
    }
});



router.get("/", ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("wishlist");
        res.render("wishlist", { wishlist: user.wishlist });
    } catch (err) {
        req.flash("error_msg", "Failed to load wishlist.");
        res.redirect("/");
    }
});

module.exports = router;
