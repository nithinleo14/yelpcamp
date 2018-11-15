var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");

//homepage
router.get("/", function(req, res) {
    res.render("landing");
});


//Signup
router.get("/register", function(req, res) {
    res.render("register");
});

// Create user
router.post("/register", function(req, res) {
    var newUser = new user({ username: req.body.username });
    user.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YeplCamp " + user.username);
            res.redirect("/campground");
        });
    })
});

//login
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
}), function(req, res) {});

//logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});

module.exports = router;
