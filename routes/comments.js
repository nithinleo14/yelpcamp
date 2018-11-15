var express = require("express");
var router = express.Router({ mergeParams: true });
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");

//new comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find by id
    // console.log(req.params.id);
    campground.findById(req.params.id, function(err, foundcampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: foundcampground });
        }
    })
});

//comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
    //find by id
    campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else { //create cooment
            comment.create(req.body.comment, function(err, createdComment) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                }
                else { //add username and id to commit
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    console.log(req.user.username);
                    //add comment to campground(association)
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    console.log(createdComment);
                    req.flash("success", "Successfully added new comment");
                    res.redirect("/campground/" + req.params.id);
                }
            });
        }
    });
});

//Comment Edit Route
router.get("/:comments_id/edit", middleware.checkCommentOwnership, function(req, res) {
    comment.findById(req.params.comments_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });

});

//Comment Update Route
router.put("/:comments_id", middleware.checkCommentOwnership, function(req, res) {
    comment.findOneAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Updated the comment");
            res.redirect("/campground/" + req.params.id);
        }
    });
});

//Comment Destroy Route
router.delete("/:comments_id", middleware.checkCommentOwnership, function(req, res) {
    comment.findByIdAndRemove(req.params.comments_id, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("success", "Comment deleted");
            res.redirect("/campground/" + req.params.id);
        }
    });
});


module.exports = router;
