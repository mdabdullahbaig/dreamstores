// var mongoose = require("mongoose");

// var reviewSchema = new mongoose.Schema({
//     rating: {
//         type: Number,
//         required: "Please provide a rating (1-5 stars).",
//         min: 1,
//         max: 5,
//         validate: {
//             validator: Number.isInteger,
//             message: "{value} is not an integer value."
//         }
//     },
//     // review text
//     text: {
//         type: String
//     },
//     // author id and username field
//     author: {
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         },
//         username: String
//     },
//     //cart associated with the review
//     cart: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Cart"
//     }
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model("Review", reviewSchema);