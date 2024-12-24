const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();

const JWT_SECRET = "your-secret-key";


router.get("/register", (req, res) => {
  res.render("register");
});


router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error_msg", "User already exists");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    req.flash("success_msg", "Registration successful. Please log in.");
    res.redirect("/login");
  } catch (error) {
    req.flash("error_msg", "Error registering user");
    res.redirect("/register");
  }
});


router.get("/login", (req, res) => {
  res.render("login");
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error_msg", "Invalid credentials");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash("error_msg", "Invalid credentials");
      return res.redirect("/login");
    }


    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });


    res.cookie("token", token, { httpOnly: true, secure: false });


    req.session.user = user;


    req.flash("success_msg", "Logged in successfully");
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error_msg", "Error logging in");
    res.redirect("/login");
  }
});



router.get("/logout", (req, res) => {
  res.clearCookie("token");
  req.flash("success_msg", "Logged out successfully");
  res.redirect("/login");
});

module.exports = router;
