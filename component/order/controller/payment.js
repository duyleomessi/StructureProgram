var express = require('express');
var paymentRoute = express.Router();

var async = require('async');
var stripe = require('stripe')('sk_test_eBc69WlaOxykHBs34Rfqietx');

var Cart = require('../../productSearch/models/cart');
var User = require('../../authentication/models/user');

paymentRoute.get('/', function (req, res, next) {
    var total = req.query.total;
    console.log('total', total);
    res.render('payment', {
        total: total
    });
});

paymentRoute.post('/', function (req, res, next) {
    /*var stripeToken = req.body.stripeToken;
    var currentCharges = Math.round(req.body.stripeMoney * 100);
    stripe.customers.create({
        source: stripeToken
    }.then(function(customer) {
        return stripe.charges.create({
            amount: currentCharges,
            currency: 'usd',
            customer: customer.id
        })
    }));*/


    /* test case: 4242424242424242*/

    async.waterfall([
        function (callback) {
            Cart.find({ userId: req.user._id }, function (err, cart) {
                callback(err, cart);
            });
        }, function (cart, callback) {
            User.findOne({ _id: req.user._id }, function (err, user) {
                if (err) return next(errr);
                if (user) {
                    for (var i = 0; i < cart[0].items.length; i++) {
                        user.history.push({
                            items: cart[0].items[i].item,
                            quantity: cart[0].items[i].quantity
                        })
                    }

                    user.save(function (err, user) {
                        console.log('user', user);
                        callback(err, user);
                    });
                }
            })
        }, function (user, callback) {
            Cart
                .findOneAndUpdate({
                    userId: req.user._id
                },
                {
                    $set: { 'items': [] }
                },
                function (err, cart) {
                    if (err) return next(err);
                    console.log('cart: ', cart);
                    res.redirect('/');
                })
        }
    ])

});

module.exports = paymentRoute;