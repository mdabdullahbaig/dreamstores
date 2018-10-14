var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var multer = require('multer');
var Cart = require("../models/cart");

router.get("/",function(req,res){
    res.render("landingpage");
});


//Register Form
router.get("/register",function(req,res){
    res.render("register");
});

//signup logic open
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username,
        email: req.body.email,
        mobilenbr: req.body.mobilenbr,
        gender: req.body.gender,
        sellername: req.body.sellername,
        shopname: req.body.shopname,
        shopaddress: req.body.shopaddress

       });
    if(req.body.isSeller === 'seller'){
        newUser.isSeller = true ;
        //res.redirect("/homeseller");
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome  to Dream Store " + user.username);
                res.redirect("/home");
        });
    });
});
//close
//login form open
router.get("/login",function(req,res){
    res.render("login");
});
//close
//login logic open
router.post("/login",passport.authenticate("local",
{
 successRedirect: "/home",
 failureRedirect: "/login",
 successFlash: "Welcome  to Dream Store and scroll down to see new added Item or Product" 
}),function(req,res){
    
}); 
//close
// logout logic open
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "You are successfully Logged Out!!!");
    res.redirect("/home");
});
//close
//middlewere open
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// USER PROFILE
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/home");
      }
      Cart.find().where('author.id').equals(foundUser._id).exec(function(err, carts) {
        if(err) {
          req.flash("error", "Something went wrong.");
          return res.redirect("/home");
        }
        res.render("profile/profile", {user: foundUser, carts: carts});
      })
    });
  });





module.exports = router;