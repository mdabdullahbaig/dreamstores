var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'diirdewi4', 
  api_key: "964815269368112" , 
  api_secret: "_zt4sk7aGDIkMLQ3UmATb5iTbJk" 
});

var User = require("../models/user");
var Cart = require("../models/cart");


router.get("/home", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Cart.find({product: regex}, function(err, allCarts){
           if(err){
               console.log(err);
           } else {
              if(allCarts.length < 1) {
                  noMatch = "No Products match that query, please try again.";
              }
              res.render("index",{carts:allCarts, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        
        Cart.find({}, function(err, allCarts){
           if(err){
               console.log(err);
           } else {
              res.render("index",{carts:allCarts, noMatch: noMatch});
           }
        });
    
    }
});



router.post("/home" ,isLoggedIn, upload.single('image') , async function(req,res){

    cloudinary.uploader.upload(req.file.path, async function(result) {
        // add cloudinary url for the image to the cart object under image property
        req.body.cart.image = result.secure_url;
        // add author to cart
        req.body.cart.author = {
          id: req.user._id,
          username: req.user.username
        };
        Cart.create(req.body.cart, function(err, cart) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
            res.redirect('/home/' + cart.id);
        });
    });  
});


router.get("/home/new",isLoggedIn, function(req,res){
    res.render("new");
});
//---------------------------------------------------------------------------------------------------------------

// show page
router.get("/home/:id",isLoggedIn, function(req,res){
    Cart.findById(req.params.id).populate("comments").exec(function(err,foundCart){
        if(err){
            console.log(err);
        } else {
            res.render("show", {cart: foundCart});
        }
    });
   
}); 

//edit cart
router.get("/home/:id/edit", checkCartOwnership, function(req,res){
        Cart.findById(req.params.id, function(err, foundCart){
        res.render("edit", {cart: foundCart});
    });
});
router.put("/home/:id", checkCartOwnership, function(req,res){
    //find and update correct cart
    Cart.findByIdAndUpdate(req.params.id, req.body.cart, function(err, updatedCart){
        if(err){
            res.redirect("/home");
        } else{
            res.redirect("/home/" + req.params.id);
        }
    });
});

//------------------------------------------------------------------------------------------------------------------
// destroy cart
router.delete("/home/:id", checkCartOwnership, function(req,res){
    Cart.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/home");
        } else {
            res.redirect("/home");
        }
    });

});

//------------------------------------------------------------------------------------------------------------------------

//middlewere open
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};
    
function checkCartOwnership(req,res,next) {
    if(req.isAuthenticated()){
        Cart.findById(req.params.id, function(err, foundCart){
            if(err){
                res.redirect("back");
            } else {
                if(foundCart.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");

                }
               
            }
        });
    } else {
    
        res.redirect("back");
    }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;
