const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();

const JWT_SECRET = "your-secret-key"; // Use environment variables for the secret key

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
      req.flash("error_msg", "User already exists");
      return res.redirect("/register");
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Create a new user with the hashed password
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    req.flash("success_msg", "Registration successful. Please log in.");
    res.redirect("/login");
  } catch (error) {
    req.flash("error_msg", "Error registering user");
    res.redirect("/register");
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
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      req.flash("error_msg", "Invalid credentials");
      return res.redirect("/login");
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch);

    if (!isMatch) {
      req.flash("error_msg", "Invalid credentials");
      return res.redirect("/login");
    }

    // Generate the token and log the user in
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("Generated Token:", token);

    // Store the token in a cookie
    res.cookie("token", token, { httpOnly: true, secure: false });

    // Store the user in the session as well
    req.session.user = user; // Store user data in session

    // Successful login
    req.flash("success_msg", "Logged in successfully");
    res.redirect("/"); // Redirect to home page
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error_msg", "Error logging in");
    res.redirect("/login");
  }
});


// Logout User
router.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  req.flash("success_msg", "Logged out successfully");
  res.redirect("/login");
});

module.exports = router;
