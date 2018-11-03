var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var multer = require('multer');
var Cart = require("../models/cart");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('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');
sgMail.setApiKey('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');

// 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





router.get("/",function(req,res){
    res.render("landingpage");
});


//Register Form
router.get("/register",function(req,res){
    res.render("register");
});

//signup logic open
router.post("/register",function(req,res){
    token = crypto.randomBytes(20).toString('hex');
    var newUser = new User(
        {
        username: req.body.username,
        email: req.body.email,
        mobilenbr: req.body.mobilenbr,
        gender: req.body.gender,
        sellername: req.body.sellername,
        shopname: req.body.shopname,
        shopaddress: req.body.shopaddress,
        shopmap: req.body.shopmap,
        verifyToken: token,
        active: false
        

       });
    if(req.body.isSeller === 'seller'){
        newUser.isSeller = true ;
        //res.redirect("/homeseller");
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            
            req.flash("error", err.message);
            return res.render("register");
        }
        // passport.authenticate("local")(req,res,function(){
        //     req.flash("success", "WELCOME TO DREAM STORE " + user.username);
        //         res.redirect("/home");
        // });
    

//sending email via sendgrid
            const msg = {
                to: user.email,
                from: 'verify@dreamstore.in',
                subject: 'Dreamstore email verification',
                text: ' Please click on the following link, or paste into your browser to verify your email address:\n\n' + 
                'http://' + req.headers.host + '/verify/' + token + '\n\n' +
                'If you did not request this, please ignore this email.\n'
            };

            sgMail.send(msg,function(err) {
                console.log('mail sent');
                req.flash ('success', 'An e-mail has been sent to ' + user.email + ' with further instructions for verification of your gmail id.');
                res.redirect("/home");
            });
    });
});


//close
//login form open
router.get("/login",function(req,res){
    res.render("login");
});
//close
//login logic open
router.post("/login",passport.authenticate("local",
{
 successRedirect: "/home",
 failureRedirect: "/login",
 successFlash: "WELCOME TO DREAM STORE, Not Just a Store."    
}),function(req,res){
    
}); 
//close
// logout logic open
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "You are successfully Logged Out!!!");
    res.redirect("/home");
});



// forgot password
router.get('/forgot', function(req, res) {
    res.render('forgot');
  });
  
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Sendgrid', 
          auth: {
            user: 'mdabdullahbaig',
            pass: 'Abdul@7438'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'resetpassword@dreamstore.in',
          subject: 'Password Reset for Dreamstore',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Sendgrid', 
          auth: {
            user: 'mdabdullahbaig',
            pass: 'Abdul@7438'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'resetpassword@dreamstore.in',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/home');
    });
  });

  //gmail verification
  router.get('/verify/:token', function(req,res) {
      async.waterfall([
          function(done) {
              User.findOne({verifyToken: req.params.token}, function(err,user) {
                  if (!user) {
                      req.flash('error', 'Token is invalid.');
                      return res.redirect('back');
                  }
                  user.verifyToken = undefined;
                  user.active = true;

                  user.save(function(err) {
                      done(err,user);
                  });
              });
          },



          //verify gmail using sendgrid

          function(user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'Sendgrid', 
              auth: {
                user: 'mdabdullahbaig',
                pass: 'Abdul@7438'
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'verify@dreamstore.in',
              subject: 'Email address verified',
              text: 'Hello,\n\n' +
                'This is a confirmation that your email ' + user.email + ' has just been verified.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                if (err) {
                    done(err);
                }
            
             req.flash('success', 'Email address has been verified.');
           // req.flash("success", "WELCOME TO DREAM STORE " + user.username + "Email address has been verified!!!" );
            res.redirect("/home");
            });
          }
        ], function(err) {
          res.redirect('/home');
        });
      });




    
  
  
  





// user profile
  router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/home");
      }
      Cart.find().where('author.id').equals(foundUser._id).exec(function(err, carts) {
        if(err) {
          req.flash("error", "Something went wrong.");
          return res.redirect("/home");
        }
        res.render("profile/profile", {user: foundUser, carts: carts});
      })
    });
  });


  //middlewere open
  function isLoggedIn(req,res,next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
  }







module.exports = router;