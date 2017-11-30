var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var assert = require('assert');

var cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
});

var Cart = module.exports = mongoose.model('Cart', cartSchema);

module.exports.getCart = function (userId, callback) {

    Cart
        .findOne({
            userId: userId
        })
        .populate('items.item')
        .exec(function (err, cart) {
            assert.equal(err, null);
            if (!cart) return callback([]);
            else return callback(cart.items);
        })
};

module.exports.addItemToCart = function (userId, itemId, callback) {
    Cart
        .findOne({
            userId: userId
        })
        .exec(function (err, cart) {
            assert.equal(err, null);

            cart.items.push({
                item: itemId
            });

            cart.save(function (err) {
                assert.equal(err, null);
                callback(cart.items);
            })
        })
}

module.exports.itemInCart = function (userId, itemId, callback) {
    Cart
        .findOne({
            userId: userId
        })
        .exec(function (err, cart) {
            assert.equal(err, null);

            if (cart.items.length == 0) {
                callback(null);
                return;
            }

            var match = 0;
            cart.items.forEach(function (item) {
                if (itemId == item.item) {
                    match++;
                    callback(item.quantity);
                    return;
                }
            })

            if (match == 0) {
                callback(null);
            }
        })
}

module.exports.updateQuantity = function (userId, quantity, itemId, callback) {

    console.log('quantity: ', quantity);
    if (quantity != 0) {
        Cart
            .findOneAndUpdate({
                    userId: userId,
                    "items.item": itemId
                }, {
                    $set: {
                        "items.$.quantity": quantity
                    }
                },
                function (err, cart) {
                    assert.equal(err, null);
                    callback(cart.items);
                })
    } else if (quantity == 0) {
        console.log("remove product");
        Cart
            .findOneAndUpdate({
                    userId: userId,
                    "items.item": itemId
                }, {
                    $pull: {
                        "items": {
                            "item": itemId
                        }
                    }
                },
                function (err, cart) {
                    assert.equal(err, null);
                    console.log("cart", cart);
                    if (cart.items.length === 0) {
                        callback(null);
                    } else callback(cart.items);
                })
    }
}