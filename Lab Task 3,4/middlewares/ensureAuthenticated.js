// middlewares/ensureAuthenticated.js
module.exports = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect("/login");
    }
};
