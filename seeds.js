var mongoose = require("mongoose");
var Cart = require("./models/cart");
var Comment = require("./models/comment");

var data = [
    {
        name         : "Salman",
        image        : "http://media2.bollywoodhungama.in/wp-content/uploads/2018/04/Salman-Khan-granted-permission-to-travel-abroad.jpg",
        description  : "Bhai jaan"
    },
    {
        name         : "Shahrukh",
        image        : "https://cdn.dnaindia.com/sites/default/files/styles/full/public/2017/06/01/580493-577504-shah-rukh.jpg",
        description  : "King khan"
    },
    {
        name         : "Amitabh",
        image        : "https://in.bmscdn.com/iedb/artist/images/website/poster/large/amitabh-bachchan-138-12-09-2017-02-34-37.jpg",
        description  : "Big b"
    }
]

function seedDB(){
// remove all cart
    Cart.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("removed carts!!");

        data.forEach(function(seed){
            Cart.create(seed, function(err, cart){
                if(err){
                    console.log(err);
                }else {
                    console.log("added a carts!");
                    //creat comment
                    Comment.create(
                        {
                            text: "I am happy",
                            author: "Abdullah"

                    },  function(err,comment){
                        if(err){
                                console.log(err);
                             } else{
                                cart.comments.push(comment);
                                cart.save();
                                console.log("Created a new comment");
                             }
                           

                    });
                }
            });
        });  
    });

    //add a few cart
   
   
}  


module.exports  =  seedDB;