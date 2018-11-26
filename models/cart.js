var mongoose = require("mongoose");


var cartSchema = new mongoose.Schema({
    product: {
        type:  String,
        required: true,
        trim: true,
        minlength: true
    },
    image: {
        type: String,
        required: true
    },
    select:  String,
    description1: String,
    description2: String,
    description3: String,
    description4: String,
    description5: String,
    description6: String,
    description: String,

    price: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    createdAt: {
        type: Date,
        default: Date.now() + 34200000
    },
    
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
    // reviews: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Review"
    //     }
    // ],
    // rating: {
    //     type: Number,
    //     default: 0
    // }
});  


module.exports = mongoose.model("Cart",cartSchema);

