const express = require("express");
let app = express();
var expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const connectDB = require("./config/db");
const adminProductsRouter = require("./routes/admin/products.router");
const adminCategoriesRouter = require("./routes/admin/categories.router");
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const cookieParser = require("cookie-parser");
const wishlistRouter = require("./routes/wishlist");
const homeRouter = require("./routes/home.router");
const Product = require("./models/product");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());


app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

const ensureAuthenticated = (req, res, next) => { if (req.session.user) { return next(); } else { res.redirect('/login'); } };
app.use(authRoutes);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
app.use((req, res, next) => {
  res.locals.cartItemCount = Object.values(req.session.cart || {}).reduce((a, b) => a + b, 0);
  next();
});

app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(expressLayouts);
let productsRouter = require("./routes/admin/products.router");
app.use(productsRouter);
app.use("/", homeRouter);

app.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    console.log(products);
    res.render("home", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});



app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use("/admin", adminProductsRouter);
app.use("/admin", ensureAuthenticated, adminCategoriesRouter);
app.use("/wishlist", wishlistRouter);

app.listen(3000, () => {
  console.log("Server started at localhost:3000");
});
connectDB();