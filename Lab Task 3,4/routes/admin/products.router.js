//routes/admin/products.router.js
const express = require("express");
let router = express.Router();
let Product = require("../../models/product");
const multer = require("multer");
const path = require("path");


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


router.get("/admin/dashboard", (req, res) => {
  res.render("admin/dashboard", { layout: "admin/admin-layout" });
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

/*router.get("/admin/products/:page?", async (req, res) => {
  let page = req.params.page ? Number(req.params.page) : 1;
  let pageSize = 2;

  // Get the products for the current page
  let products = await Product.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  // Get the total number of products
  let totalRecords = await Product.countDocuments();

  // Calculate the total number of pages
  let totalPages = Math.ceil(totalRecords / pageSize);

  // Ensure that page and totalPages are passed to the view
  res.render("admin/products", {
    layout: "admin/admin-layout",
    products,
    page,        // Pass the current page
    totalPages,  // Pass the total pages
  });
});*/





module.exports = router;