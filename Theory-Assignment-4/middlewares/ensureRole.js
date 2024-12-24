// middlewares/ensureRole.js
module.exports = (requiredRole) => {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === requiredRole) {
            return next();
        } else {
            res.status(403).send("Access denied");
        }
    };
};
