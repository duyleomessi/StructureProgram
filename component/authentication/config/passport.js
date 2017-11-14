var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// serialize and deserialize
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// middleware
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        console.log('user: ', user);
        if (err) return done(err);

        if (!user) return done(null, false, req.flash('userNotExist', 'Email is not register'));

        if (!user.comparePassword(password)) return done(null, false, req.flash('passwordIncorrect', "The password is incorrect"));

        else {
            console.log('succesfully login');
            return done(null, user);
        }
    })
}))

// check login
module.exports.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else res.redirect('/user/login');
}
