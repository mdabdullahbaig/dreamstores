var mongoose = require("mongoose");


var cartSchema = new mongoose.Schema({
    product:    String,
    image:   String,
    select:  String,
    description1: String,
     description2: String,
    description3: String,
    description4: String,
    description5: String,
    description6: String,
    description: String,

    price: String,
    author:  {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },

    comments: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
});  


module.exports = mongoose.model("Cart",cartSchema);

