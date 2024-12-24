const express = require("express");
let app = express();
var expressLayouts = require("express-ejs-layouts");
const mongoose = require ("mongoose");
let ProductModal = require ("./modals/products.modals.js");
let connection = require ("./config/db.js")
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(expressLayouts);
let productsRouter = require("./routes/admin/products.router");
app.use(productsRouter);
app.get("/resume", (req, res) => {
  res.render("resume");
});

app.get("/", (req, res) => {
  res.render("home");
});


app.listen(5000, () => {
  console.log("Server started at localhost:5000");
});