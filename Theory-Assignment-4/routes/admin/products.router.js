//routes/admin/products.router.js
const express = require("express");
let router = express.Router();
let Product = require("../../models/product");
const multer = require("multer");
const path = require("path");
const Order = require('../../models/order');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});



router.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sort = req.query.sort || "title";
    const order = req.query.order || "asc";

    const filter = {};
    if (req.query.isFeatured) {
      filter.isFeatured = req.query.isFeatured === "true";
    }

    const totalProducts = await Product.countDocuments({
      ...filter,
      title: { $regex: search, $options: "i" },
    });

    const products = await Product.find({
      ...filter,
      title: { $regex: search, $options: "i" },
    })
      .sort({ [sort]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("admin/products", {
      layout: "admin/admin-layout",
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      search,
      sort,
      order,
      isFeatured: req.query.isFeatured,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/products/create", (req, res) => {
  res.render("admin/create", { layout: "admin/admin-layout" });
})

router.post("/products/create", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, isFeatured } = req.body;
    const isFeaturedValue = isFeatured === "on";


    const imagePath = req.file ? req.file.path : null;


    const product = await Product.create({
      title,
      description,
      price,
      isFeatured: isFeaturedValue,
      image: imagePath,
    });
    req.flash("success_msg", "Product created successfully.");
    res.redirect("/admin/products");
  } catch (error) {
    req.flash("error_msg", "Error creating product.");
    res.status(500).send("Error Creating Product");
  }
});


router.get("/admin/products/edit/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return req.status(404).send("Product Not Found");
  }
  res.render("admin/product-edit-form", {
    product,
    layout: "admin/admin-layout"
  });
})

router.post("/admin/products/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, isFeatured } = req.body;
    const isFeaturedValue = isFeatured === "on";
    const imagePath = req.file ? req.file.path : undefined;

    const updateData = {
      title,
      description,
      price,
      isFeatured: isFeaturedValue,
    };


    if (imagePath) {
      updateData.image = imagePath;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send("Product Not Found");
    }
    req.flash("success_msg", "Product updated successfully.");
    res.redirect("/admin/products");
  } catch (error) {
    req.flash("error_msg", "Error updating product.");
    res.status(500).send("Error Updating Product");
  }
});


router.get("/admin/products/delete/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  return res.redirect("back");
})

router.get("/admin/dashboard", async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 }).limit(10);
    res.render("admin/dashboard", {
      layout: "admin/admin-layout",
      orders: orders || [],
      error: null
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.render("admin/dashboard", {
      layout: "admin/admin-layout",
      orders: [],
      error: "An error occurred while fetching orders"
    });
  }
});





module.exports = router;