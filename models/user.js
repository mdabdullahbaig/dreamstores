var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {
        type:String, 
        required: true,
        trim: true,
        minlength: 1
    }, 
    mobilenbr: {
        type:  String,
        required: true,
        trim: true,
        minlength: 1
    },
    gender: {
        type:  String,
        required: true
    },
    password: String,
    email: {
        type:  String,
        required: true,
        trim: true,
        minlength: 1
    },
    sellername: {
        type:  String,
        trim: true
    },
    shopname: {
        type:  String,
        trim: true
    },
    shopaddress: {
        type:  String,
        trim: true
    },
    isSeller: {
        type: Boolean,
        default: false
    }
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);