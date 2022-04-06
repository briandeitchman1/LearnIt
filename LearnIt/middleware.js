const StudyPage = require("./models/studyPage")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect('/login');
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    studyPage = await StudyPage.findById(req.params.id);
    // stops anyone but the owner from editing/deleting
    if (!studyPage.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that");
        return res.redirect(`/study/${req.params.id}`);
    }
    next();
}