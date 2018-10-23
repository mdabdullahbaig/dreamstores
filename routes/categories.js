var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");
// for the shop category

router.get("/home/category/shop", function(req,res) {
    Cart.find({select: "Shop Information"}, function(err, allshops){
        if(err) {
            console.log(err);
        } else {
            res.render("category/showshop", {carts: allshops});
        }
    });
});

//for category books
router.get("/home/category/bookstationeries",function(req,res){
    Cart.find({select: "Books & Stationeries"},function(err, allBooks){
        if(err){
            console.log(err);
        } else {
            res.render("category/books",{carts: allBooks});
        }
    });
    });
//----------------------------------------------------------------------------------------------------------------
//for category Electronics
router.get("/home/category/Electronics",function(req,res){
    Cart.find({select: "Electronics"},function(err, allElectronics){
        if(err){
            console.log(err);
        } else {
            res.render("category/electronics",{carts: allElectronics});
        }
    });
    });
//----------------------------------------------------------------------------------------------------------------
//for category Furnitures
router.get("/home/category/Furnitures",function(req,res){
    Cart.find({select: "Furnitures"},function(err, allFurnitures){
        if(err){
            console.log(err);
        } else {
            res.render("category/furnitures",{carts: allFurnitures});
        }
    });
    });
//----------------------------------------------------------------------------------------------------------------
//for category Home Appliances
router.get("/home/category/HomeAppliances",function(req,res){
    Cart.find({select: "Home Appliances"},function(err, allHomeAppliances){
        if(err){
            console.log(err);
        } else {
            res.render("category/homeappliances",{carts: allHomeAppliances});
        }
    });
    });
//---------------------------------------------------------------------------------------------------------------
//for category Fashion
router.get("/home/category/Fashion",function(req,res){
    Cart.find({select: "Fashion"},function(err, allFashions){
        if(err){
            console.log(err);
        } else {
            res.render("category/fashion",{carts: allFashions});
        }
    });
    });
//-----------------------------------------------------------------------------------------------------------
//for category Phones
router.get("/home/category/Phones",function(req,res){
    Cart.find({select: "Phones"},function(err, allPhones){
        if(err){
            console.log(err);
        } else {
            res.render("category/phones",{carts: allPhones});
        }
    });
    });
//----------------------------------------------------------------------------------------------------------------
//for category Sports
router.get("/home/category/Sports",function(req,res){
    Cart.find({select: "Sports"},function(err, allSports){
        if(err){
            console.log(err);
        } else {
            res.render("category/sports",{carts: allSports});
        }
    });
    });
//----------------------------------------------------------------------------------------------------------------
//for category Sweets & Cake
router.get("/home/category/SweetsCake",function(req,res){
    Cart.find({select: "Sweets & Cake"},function(err, allSweets){
        if(err){ 
            console.log(err);
        } else {
            res.render("category/sweets",{carts: allSweets});
        }
    });
    });



    //middlewere open
    function isLoggedIn(req,res,next){
        var active;
       if(req.isAuthenticated()){
         function verify() {
           User.findOne({email: req.user.email}, function(err,user) {
             active = user.active;
             if (active = true) {
               return next();
             }
             req.flash("error", "You need to verify your email to see the content!");
             res.redirect("/home");
           
           });
         } 
         return verify();
          } else {
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("/login");
          }
     };
    

module.exports = router;

