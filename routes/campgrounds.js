var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware")

//campground index
router.get("/", function(req, res) {
    //get data from db
    campground.find({}, function(err, allcampground) {
        if (err || !allcampground) {
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            res.redirect('/campgrounds');
        }
        else {
            res.render("campgrounds/index", { campground: allcampground });
        }
    });

});

//campgroundform
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")

});


//create campground
router.post("/", middleware.isLoggedIn, function(req, res) {

    //get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, price: price, image: image, description: description, author: author };
    //Create a new campground ansave it to db
    campground.create(newCampground, function(err, newObj) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newObj);
            req.flash("success", "New campground " + newObj.name + " created");
            //redirect back to campgrounds page
            res.redirect("/campground");
        }
    });
});



//show
router.get("/:id", function(req, res) {
    //find campground using id
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log("Error Start:\n" + err + "\n\nError End");
        }
        else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    campground.findById(req.params.id, function(err, foundCampground) {

        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        }
        else {
            res.redirect("/campground/" + req.params.id);
        }
    });
});

//============================
//Destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/campground/:id");
        }
        else {
            req.flash("success", "Campground deleted");
            res.redirect("/campground");
        }
    });
});


//============================

module.exports = router;
