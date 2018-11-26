// var express = require("express");
// var router = express.Router({mergeParams: true});
// var passport = require("passport");
// var Cart = require("../models/cart");
// var Review = require("../models/review");




// //Review Index
// router.get("/", function(req,res) {
//     Cart.findById(req.params.id).populate({
//         path: "reviews",
//         options: {sort: {createdAt: -1}}
//     }).exec(function (err, cart) {
//         if (err || !cart) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         res.render("reviews/index", {cart:cart});
//     });
// });

// // Reviews New
// router.get ("/new", isLoggedIn, checkReviewExistence, function (req,res) {
//     Cart.findById(req.params.id, function (err, cart) {
//         if (err) {
//             req.flash("error", err.message);
//             return res.redirect("back");
//         }
//         res.render("reviews/new", {cart:cart});
//     });
// });

// //review create
// router.post("/", isLoggedIn, checkReviewExistence, function(req,res) {
//    Cart.findById(req.params.id).populate("reviews").exec(function (err, cart){
//        if (err) {
//            req.flash("error", err.message);
//            return  res.redirect("back");
//        }
//         Review.create(req.body.review, function(err, review) {
//                 if (err) {
//                     req.flash("error", err.message);
//                     return res.redirect("back");
//                 }
            
//             review.author.id = req.user._id;
//             review.author.username = req.user.username;
//             review.cart = cart;
//             review.save();
//             cart.reviews.push(review);
//             //calculate the avg review
//             cart.rating = calculateAverage(cart.reviews);
//             //save cart
//             cart.save();
//             req.flash("success", "Your review has been successfully added.");
//             res.redirect('/home/' + cart._id);
//         });
       
//     }) ;
// });
// //review edit 
// router.get("/:review_id/edit", checkReviewOwnership, function (req, res){
//     Review.findById(req.params.review_id, function(err, foundReview) {
//         if (err) {
//             req.flash("error", err.message);
//             return  res.redirect("back");  
//         }
//         res.render("review/edit", {cart_id: req.params.id,review: foundReview});
//     });
// });
// //review update
// router.put("/:review_id", checkReviewOwnership, function (req, res) {
//     Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new:true}, function(err, updatedReview){
//         if (err) {
//             req.flash("error", err.message);
//             return  res.redirect("back");  
//         }
//         Cart.findById(req.params.id).populate("reviews").exec(function (err, cart) {
//             if (err) {
//                 req.flash("error", err.message);
//                 return  res.redirect("back");  
//             }
//             //recalcute cart avg
//             cart.rating = calculateAverage(cart.reviews);
//             cart.save();
//             req.flash("success", "Your review was successfully edited.");
//             res.redirect('/home/' + cart._id);   
//         });   
//     });
// });
// //review delete
// router.delete("/:review_id", checkReviewOwnership, function (req, res) {
//     Review.findByIdAndRemove(req.params.review_id, function(err) {
//         if (err) {
//             req.flash("error", err.message);
//             return  res.redirect("back");  
//         }
//         Cart.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, cart) {
//             if (err) {
//                 req.flash("error", err.message);
//                 return  res.redirect("back");  
//             }
//             cart.rating = calculateAverage(cart.reviews);
//             cart.save();
//             req.flash("success", "Your review was successfully deleted.");
//             res.redirect('/home/' + cart._id);               

//         });   
//     });
// });

// function calculateAverage(reviews) {
//     if (reviews.length === 0) {
//         return 0;
//     }
//     var sum = 0;
//     reviews.forEach(function (element) {
//         sum += element.rating;
//     });
//     return sum / reviews.length;
// }


// //middlewere open
// function isLoggedIn(req,res,next){
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
//   }



// function checkReviewOwnership(req, res, next) {
//     if(req.isAuthenticated()){
//         Review.findById(req.params.review_id, function(err, foundReview){
//             if(err || !foundReview){
//                 res.redirect("back");
//             }  else {
//                 // does user own the comment?
//                 if(foundReview.author.id.equals(req.user._id)) {
//                     next();
//                 } else {
//                     req.flash("error", "You don't have permission to do that");
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         req.flash("error", "You need to be logged in to do that");
//         res.redirect("back");
//     }
// };

// function checkReviewExistence(req, res, next) {
//     if (req.isAuthenticated()) {
//        Cart.findById(req.params.id).populate("reviews").exec(function (err, foundCart) {
//             if (err || !foundCart) {
//                 req.flash("error", "Cart not found.");
//                 res.redirect("back");
//             } else {
//                 // check if req.user._id exists in foundCart.reviews
//                 var foundUserReview = foundCart.reviews.some(function (review) {
//                     return review.author.id.equals(req.user._id);
//                 });
//                 if (foundUserReview) {
//                     req.flash("error", "You already wrote a review.");
//                     return res.redirect("back");
//                 }
//                 // if the review was not found, go to the next middleware
//                 next();
//             }
//         });
//     } else {
//         req.flash("error", "You need to login first.");
//         res.redirect("back");
//     }
// };



// module.exports = router;