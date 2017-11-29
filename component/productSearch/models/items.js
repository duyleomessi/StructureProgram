// var MongoClient = require('mongodb').MongoClient,
var mongoose = require('mongoose');
var assert = require('assert');


var commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String
    },
    stars: {
        type: Number,
        required: true
    },
    date: Date
})

var itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slogan: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    reviews: [commentSchema]
})

itemSchema.index({
    title: 'text',
    description: 'text',
    slogan: 'text'
});

var Item = module.exports = mongoose.model('Item', itemSchema);


/**
 * search the item that has the same category
 * @param  {} category 
 * @param  {} callback
 * 
 */
module.exports.getRelatedItems = function (category, callback) {
    var query = {
        category: category
    };
    Item
        .find(query)
        .limit(4)
        .exec(function (err, result) {
            assert.equal(err, null);
            if (!result || result.length === 0) {
                console.log('error at result: ', result);
                return;
            } else {
                callback(result);
            }
        })
}

module.exports.addReview = function (itemId, review, name, stars, callback) {
    var newReview = {
        name: name,
        comment: review,
        stars: stars,
        date: new Date()
    }

    Item
        .update({
            _id: itemId
        }, {
            $push: {
                reviews: newReview
            }
        })
        .exec(function (err, result) {
            assert.equal(err, null);
            callback();
        })
}


module.exports.searchItems = function (queryString, page, ITEMS_PER_PAGE, callback) {
    Item
        .find({
            $text: {
                $search: queryString,
                $caseSensitive: false
            }
        })
        .sort({
            _id: 1
        })
        .skip(page * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .exec(function (err, result) {
            assert.equal(err, null);
            if (!result) {
                console.log('error result');
                return;
            } else {
                callback(result);
            }

        })
}
