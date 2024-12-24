const express = require("express");
let router = express.Router();
let Product = require ("../../modals/products.modals.js");
router.get("/admin/dashboard", (req, res) => {
  res.render("admin/dashboard", { layout: "admin/admin-layout" });
});
router.get("/admin/product/create", (req, res) => {
  res.render("admin/product-form", { layout: "admin/admin-layout" });
});
router.get("/admin/product/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  return res.redirect("back");
});
router.get("/admin/product/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  return res.render("admin/product-edit-form", {
    product,
    layout: "admin/admin-layout",
  });
});
router.post("/admin/product/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  product.isFeatured = Boolean(req.body.isFeatured);
  await product.save();
  return res.redirect("/admin/product");
});

router.post("/admin/product/create", async (req, res) => {
  try {
    // Create a new product
    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      isFeatured: Boolean(req.body.isFeatured),
    });

    // Save the product to the database
    await newProduct.save();

    // Redirect to the product listing page
    res.redirect("/admin/product");
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Internal Server Error");
  }
});



router.get("/admin/product", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch products from the database
    res.render("admin/product", { layout: "admin/admin-layout", products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;