var express = require('express');
var cartRoute = express.Router();
var async = require('async');

//var Cart = require('../models/cart');
var Cart = require('../../productSearch/models/cart');

function cartTotal(userCart) {
    var total = 0;
    for (var i = 0; i < userCart.length; i++) {
        total += userCart[i].item.price * userCart[i].quantity;
    }
    return total.toFixed(2);
}

cartRoute.get('/', function (req, res, next) {
    Cart.getCart(req.user._id, function (userCart) {
        var total = cartTotal(userCart);
        console.log("userCart", userCart);
        res.render('cart', {
            cart: userCart,
            total: total,
            updated: false
        });
    })
});


cartRoute.post('/items/:itemId', function (req, res, next) {
    var userId = req.user._id;
    var itemId = req.params.itemId;

    Cart.itemInCart(userId, itemId, function (numItem) {
        if (numItem == null) {
            Cart.addItemToCart(userId, itemId, function (userCart) {
                console.log('add userCart');
                res.redirect('/cart');
            })
        } else if (numItem > 0) {
            Cart.updateQuantity(userId, numItem + 1, itemId, function (userCart) {
                console.log('update userCart');
                res.redirect('/cart');
            })
        }
    })
})


cartRoute.post("/items/:itemId/quantity", function (req, res, next) {
    var itemId = req.params.itemId;
    var quantity = req.body.quantity;
    var userId = req.user._id;

    Cart.updateQuantity(userId, quantity, itemId, function (userCart) {
        res.redirect('/cart');
    })
})


module.exports = cartRoute;