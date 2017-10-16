// var MongoClient = require('mongodb').MongoClient,
//     assert = require('assert');


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var assert = require('assert');

var cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [{
        item: { type: Schema.Types.ObjectId, ref: 'Item' },
        quantity: { type: Number, default: 1 }
    }]
});

var Cart = module.exports = mongoose.model('Cart', cartSchema);

module.exports.getCart = function (userId, callback) {

    Cart
        .findOne({ userId: userId })
        .populate('items.item')
        .exec(function (err, cart) {
            assert.equal(err, null);
            if (!cart) return callback([]);
            else return callback(cart.items);
        })
};

module.exports.addItemToCart = function (userId, itemId, callback) {
    Cart
        .findOne({ userId: userId })
        .exec(function (err, cart) {
            assert.equal(err, null);

            cart.items.push({ item: itemId });

            cart.save(function (err) {
                assert.equal(err, null);
                callback(cart.items);
            })
        })
}

module.exports.itemInCart = function (userId, itemId, callback) {
    Cart
        .findOne({ userId: userId })
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
            },
            {
                $set: { "items.$.quantity": quantity }
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
                $pull: { "items": { "item": itemId } }
            },
            function (err, cart) {
                assert.equal(err, null);
                console.log("cart", cart);
                if (cart.items.length === 0) {
                    callback(null);
                }
                else callback(cart.items);
            })
    }
}





/*function CartDAO(database) {
    "use strict";

    this.db = database;


    this.getCart = function (userId, callback) {
        "use strict";

        var query = {
            'userId': userId
        }

        var userCart = {
            userId: userId,
            items: []
        }

        this.db.collection('cart').find(query).toArray(function (err, result) {
            assert.equal(err, null);
            console.log("result: ", result);
            for (var i = 0; i < result[0].items.length; i++) {
                var item = result[0].items[i];
                userCart.items.push(item);
            }
            callback(userCart);
        })

    }


    this.itemInCart = function (userId, itemId, callback) {
        "use strict";

        var query = {
            'userId': userId,
            'items._id': itemId
        }

        var project = {
            '_id': 0,
            'items.$': 1
        }

        this.db.collection('cart').find(query, project).toArray(function (err, result) {
            assert.equal(err, null);
            if (result.length === 0) {
                callback(null);
            } else {
                var item = result[0].items[0];
                callback(item);
            }

        })

    }

    this.addItem = function (userId, item, callback) {
        "use strict";

        this.db.collection("cart").findOneAndUpdate(
            {userId: userId},
            {"$push": {items: item}},
            {
                upsert: true,
                returnOriginal: false
            },
            function (err, result) {
                assert.equal(null, err);
                callback(result.value);
            });
    };


    this.updateQuantity = function (userId, itemId, quantity, callback) {
        "use strict";

        var query = {
            'userId': userId,
            'items._id': itemId
        };

        this.db.collection('cart').findOneAndUpdate(
            query,
            ((quantity !== 0) ? {$set: {'items.$.quantity': quantity}} : {$pull: {'items': {'_id': itemId}}}),
            {returnOriginal: false},
            function (err, result) {
                assert.equal(err, null);
                callback(result.value);
            })
    }

}*/


// module.exports.CartDAO = CartDAO;
