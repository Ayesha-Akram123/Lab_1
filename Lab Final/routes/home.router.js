// routes/home.router.js
const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.render("home", { products });
    } catch (error) {
        console.error("Error fetching products for home page:", error);
        res.status(500).send("Error loading home page");
    }
});

module.exports = router;
