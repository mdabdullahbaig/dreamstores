var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");
var Comment = require("../models/comment");

router.get("/home/:id/comments/new", function(req,res){
    //find cart by id
    Cart.findById(req.params.id, function(err, cart){
        if(err){
            console.log(err);
        } else {
            res.render("show",{cart: cart});
        }
    })
   
});

router.post("/home/:id/comments",isLoggedIn, function(req,res){
    Cart.findById(req.params.id, function(err, cart){
        if(err){
            console.log(err);
            res.redirect("/home");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();

                    
                   cart.comments.push(comment);
                    cart.save(); 
                   res.redirect("/home/" + cart._id);
                }
            })
            //res.render("comments/new",{cart: cart});
        }
    })
});  
//----------------------------------------------------------------------------------------------------------------------------
router.get("/home/:id/comments/:comment_id/edit", checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("editcomment", {cart_id: req.params.id, comment: foundComment});

        }
    });

});

//comment update
router.put("/home/:id/comments/:comment_id",checkCommentOwnership, function(req,res){
     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/home/" + req.params.id);
        }
     });
});
// Destroy comment
router.delete("/home/:id/comments/:comment_id",checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/home/" + req.params.id);
        }
    });
});





//middlewere open
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

function checkCommentOwnership(req,res,next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
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


module.exports = router;  