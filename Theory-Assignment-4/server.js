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




app.set("views", path.join(__dirname, "views"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,

}));
app.use(flash());

// Middleware to pass flash messages to views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
// Authentication Middleware 
const ensureAuthenticated = (req, res, next) => { if (req.session.user) { return next(); } else { res.redirect('/login'); } };
app.use(authRoutes);
// Middleware to pass user object to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // `user` will be accessible in all EJS templates
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


app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("home", { username: req.session.user.username });
});


app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use("/admin", ensureAuthenticated, adminProductsRouter);
app.use("/admin", ensureAuthenticated, adminCategoriesRouter);

app.listen(5000, () => {
  console.log("Server started at localhost:5000");
});
connectDB();