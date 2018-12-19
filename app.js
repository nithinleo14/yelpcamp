var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    seedDB = require("./seeds");

//models require
var user = require("./models/user"),
    campground = require("./models/campground"),
    comment = require("./models/comment");

//routes require
var campgroundRoute = require("./routes/campgrounds"),
    commentRoute = require("./routes/comments"),
    indexRoute = require("./routes/index");


//var uri = "mongodb://localhost/yelp_campv13"
//var uri = "mongodb://leo:leo12515@ds041327.mlab.com:41327/yelpcamp12515"
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the db

//Passport Config
app.use(require("express-session")({
    secret: "Leo14",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//middleware function to get the current user for every routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); //Must else the remaining routes won't run
});

//==============================================
app.use(indexRoute);
app.use("/campground", campgroundRoute);
app.use("/campground/:id/comments", commentRoute);


//listen
var server = app.listen(process.env.PORT, process.env.IP, function() {
    var port = server.address().port;
    console.log("Server running successfully!!!: " + port);
});
