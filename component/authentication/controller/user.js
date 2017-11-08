var express = require('express');
var userRoute = express.Router();
var passport = require('passport');
var passportConf = require('../../../config/passport');
var async = require('async');

var User = require('../models/user');
//var Cart = require('../models/cart');

userRoute.get('/', function(req, res, next) {
    res.redirect('/user/register');
});

userRoute.get('/register', function (req, res, next) {
    res.render('register');
});

userRoute.post('/register', function (req, res, next) {

    // async.waterfall([
    //     function (callback) {
            var newUser = new User({
                email: req.body.email,
                password: req.body.password
            })

            User
                .findOne({ email: req.body.email })
                .exec(function (err, result) {
                    console.log('result: ', result);
                    if (err) return next(err);
                    if (result) {
                        req.flash('emailError', 'The email is alredy exists');
                        //console.log('emailError', req.flash('emailError').length );
                        return res.redirect('/user/register');
                    } else {
                        newUser.save(function (err, user) {
                            if (err) return next(err);
                            //res.json('Succefully create new user');
                            //callback(null, user);
                            return res.redirect('http://localhost:8081/');
                        })
                    }
                })
    //     },
    //     function (user) {
    //         var cart = new Cart({
    //             userId: user._id
    //         });
    //         cart.save(function (err) {
    //             if (err) next(err);
    //             req.logIn(user, function (err) {
    //                 if (err) return next(err);
    //                 return res.redirect('/');
    //             })
    //         });
    //     }
    // ]);
});

userRoute.get('/login', function (req, res, next) {
    if (req.user) return res.redirect('/');
    res.render('login');
});

userRoute.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: 'http://localhost:8081/',
    failureFlash: true
}));

userRoute.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('http://localhost:8081/');
});

module.exports = userRoute;