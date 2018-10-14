var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String, 
    mobilenbr: String,
    gender: String,
    password: String,
    email:    String,
    sellername: String,
    shopname: String,
    shopaddress: String,
    isSeller: {type: Boolean,default: false}
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);