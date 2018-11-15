var mongoose = require("mongoose");
var campground = require("./models/campground");
var comment = require("./models/comment");

var data = [{
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis alias esse, quidem distinctio ratione, maxime similique ipsa, earum officiis, cum voluptatem! Aliquid animi officiis amet temporibus aliquam, omnis similique debitis."
    },
    {
        name: "Desert Mesa",
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis alias esse, quidem distinctio ratione, maxime similique ipsa, earum officiis, cum voluptatem! Aliquid animi officiis amet temporibus aliquam, omnis similique debitis."
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis alias esse, quidem distinctio ratione, maxime similique ipsa, earum officiis, cum voluptatem! Aliquid animi officiis amet temporibus aliquam, omnis similique debitis."
    }
];

function seedDB() {
    ///remove all campgrounds
    campground.deleteMany({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed Campground");
        //add few campground
        data.forEach(function(seed) {
                        campground.create(seed, function(err, campground) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Created");
                                //create comments
                                comment.create({
                                    text: "This is a sample campground app",
                                    author: "Leo"
                                }, function(err, comment1) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        campground.comments.push(comment1);
                                        campground.save();
                                        console.log("Comments created");
                                    }
                                });
                            }
                        });
                    });
    });
}

module.exports = seedDB;
