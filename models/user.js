var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require("bcrypt-nodejs");
  
var UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: true,
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
        unique: true,
        required: true,
        trim: true,
        minlength: 1
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verifyToken: String,
    active: Boolean,
    google: {
        id: String,
        token: String
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