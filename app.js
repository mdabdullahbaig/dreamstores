var express             =  require("express"),
    app                 =  express(),
    bodyParser          =  require("body-parser"),
    mongoose            =  require("mongoose"),
    flash               =  require("connect-flash"),
    passport            =  require("passport"),
    LocalStrategy       =  require("passport-local"),
    methodOverride      =  require("method-override"),
    multer              =  require('multer'),
    Cart                =  require("./models/cart"),
    User                =  require("./models/user"),
    Comment             =  require("./models/comment"),
    seedDB              =  require("./seeds"),
    morgan              =  require('morgan'),
    MongoClient         =  require('mongodb').MongoClient;


    //seedDB();  //seed the database

   var cartRoutes       =  require("./routes/carts"),
       indexRoutes       =  require("./routes/index"), 
       commentRoutes     =  require("./routes/comments"),
       categoryRoutes    =  require("./routes/categories");
     //  var deferredPrompt;
    var navigator = require('web-midi-api');

   var configDB = require('./config/database.js');

   mongoose.set('debug' , true);
   mongoose.connect(configDB.url);
   mongoose.Promise =Promise;
   //mongodb://<dbuser>:<dbpassword>@ds131763.mlab.com:31763/dreamstore




   const port = process.env.PORT || 3000 ;


    
    // mongoose.connect("mongodb://mdabdullahbaig:Abdul@7438@ds131763.mlab.com:31763/dreamstore");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('uploads'));
app.use(express.static("public"));

app.set("view engine","ejs");
app.use(methodOverride('_method'));
app.use(flash());

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

//----------------------------------------------------------------------------------------------------------------
//service worker
// if (!window.Promise) {
//     window.Promise = Promise;
//   }

if('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
        console.log('Service worker register!');

    })
    .catch(function(err) {
        console.log(err);
    });
};
// window.addEventListener('beforeinstallprompt', function(event) {
//     console.log('beforeinstallprompt fired');
//     event.preventDefault();
//     defferredPrompt = event;
//     return false;
// });

// var promise = new Promise(function(resolve, reject) {
//     setTimeout(function() {
//         reject({code: 500, message: "An error occurred!"});
//        // resolve('This is executed once the timer is done!');
//     }, 3000);
// });

// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://httpbin.org/ip');
// xhr.responseType = 'json';

// xhr.onload = function() {
//     console.lod(xhr.response);
// };

// xhr.onerror = function() {
//     console.log('Error!');
// };

// xhr.send();

// fetch('https://httpbin.org/ip')
//     .then(function(response) {
//         console.log(response);
//         response.json();
//     })
//         .then(function(data) {
//             console.log(data);
//         })
//         .catch(function(err) {
//             console.log(err);
//         });

    //     fetch('https://httpbin.org/post', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         },
    //         mode: 'cors',
    //         body: JSON.stringify( {message: 'Does this work?'})
    //     })
    // .then(function(response) {
    //     console.log(response);
    //     response.json();
    // })
    //     .then(function(data) {
    //         console.log(data);
    //     })
    //     .catch(function(err) {
    //         console.log(err);
    //     });

// promise.then(function(text) {
//     return text;
// }).then(function(newText) {
//     console.log(newText);
// }).catch(function(err) {
//     console.log(err.code,err.message)
// });

//console.log('This is executed right after setTimeout()');
app.get("/home/currentuser/profile", function(req,res){
    res.render("profile/currentprofile");
});

app.get("/home/currentseller/profile", function(req,res){
    res.render("profile/sellerprofile");
});









app.listen(port, function(){
    console.log("server started!!!");
}); 