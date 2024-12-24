// middlewares/ensureRole.js
// Middleware to Check Role
const ensureRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).send("Access denied");
    }
    next();
};

