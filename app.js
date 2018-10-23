// require('dotenv').config();
var express             =  require("express"),
    app                 =  express(),
    bodyParser          =  require("body-parser"),
    mongoose            =  require("mongoose"),
    flash               =  require("connect-flash"),
    passport            =  require("passport"),
    LocalStrategy       =  require("passport-local"),
    cookieParser        =  require("cookie-parser"),
    methodOverride      =  require("method-override"),
    multer              =  require('multer'),
    Cart                =  require("./models/cart"),
    User                =  require("./models/user"),
    Comment             =  require("./models/comment"),
    seedDB              =  require("./seeds"),
    MongoClient         =  require('mongodb').MongoClient,
    morgan              =  require('morgan');
   

// var  cookieParser        = require("cookie-parser"),
    //seedDB();  //seed the database

     var http = require('http');
    // var socketIO = require('socket.io');
    // var server = http.createServer(app);
    // var io = socketIO(server);
    // const path = require('path');

   var cartRoutes       =  require("./routes/carts"),
       indexRoutes       =  require("./routes/index"), 
       commentRoutes     =  require("./routes/comments"),
       categoryRoutes    =  require("./routes/categories");
    
   var configDB = require('./config/database.js');

   mongoose.set('debug' , true);
   mongoose.connect(configDB.url);
   mongoose.Promise =Promise;

  // require('./config/passport')(passport);
   //mongodb://<dbuser>:<dbpassword>@ds131763.mlab.com:31763/dreamstore




   const port = process.env.PORT || 3000 ;


    
    // mongoose.connect("mongodb://mdabdullahbaig:Abdul@7438@ds131763.mlab.com:31763/dreamstore");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('uploads'));
app.use(express.static("public"));
app.use (bodyParser.json());

app.set("view engine","ejs");
app.use(methodOverride('_method'));
// app.use(cookieParser());
// app.use(morgan('dev'));
app.use(flash());
app.locals.moment = require("moment");
app.use(cookieParser('secret'));
app.use(morgan('dev'))

//PASSPORT CONFIGURATION open
app.use(require("express-session")({
 secret: "My PIN nbr",
 resave: false,
 saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//close
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



 
app.use(indexRoutes);
app.use(cartRoutes);
app.use(commentRoutes);
app.use(categoryRoutes);
 

app.get("/home/currentuser/profile", function(req,res){
    res.render("profile/currentprofile");
});

app.get("/home/currentseller/profile", function(req,res){
    res.render("profile/sellerprofile");
});









app.listen(port, function(){
    console.log("server started!!!");
}); 