// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const ensureRole = require("../middlewares/ensureRole");

// Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register User
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const user = new User({ username, email, password, role });
    await user.save();
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error registering user");
  }
});

// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    req.session.user = user;
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

// Logout User
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Admin Dashboard
router.get("/admin", ensureAuthenticated, ensureRole("admin"), (req, res) => {
  res.send("Welcome to the Admin Dashboard");
});

// Customer Dashboard
router.get("/customer", ensureAuthenticated, ensureRole("customer"), (req, res) => {
  res.send("Welcome to the Customer Dashboard");
});

module.exports = router;
