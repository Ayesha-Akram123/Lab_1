const jwt = require("jsonwebtoken");
const JWT_SECRET = "your-secret-key"; // Ensure the secret key is loaded

const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token from cookie:", token);

    if (!token) {
        req.flash("error_msg", "Please log in to access this page");
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.user = decoded;  // Attach user information to the request object
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        req.flash("error_msg", "Invalid token. Please log in again.");
        res.redirect("/login");
    }
};

module.exports = ensureAuthenticated;
