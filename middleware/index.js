//all the middleware goes here
var middlewareObj = {};
var campground = require("../models/campground");
var comment = require("../models/comment");


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //Is the user logged in?
    if (req.isAuthenticated()) {
        campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground cannot be edited");
                res.redirect("back");
            }
            else {
                //Does user own the comment?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("/login");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    //Is the user logged in?
    if (req.isAuthenticated()) {
        comment.findById(req.params.comments_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "You need to be logged in.");
                res.redirect("back");
            }
            else {
                //Does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be loogged in");
    res.redirect("/login");
};

module.exports = middlewareObj;
