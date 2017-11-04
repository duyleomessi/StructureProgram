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

module.exports.getCategories = function (callback) {
    var group = {
        _id: '$category',
        num: {
            $sum: 1
        }
    }
    var sort = {
        _id: 1
    }

    Item.aggregate([{
            $group: group
        },
        {
            $sort: sort
        },
    ], function (err, result) {
        assert.equal(err, null);
        var all = {
            _id: 'All',
            num: 0
        };
        if (!result || result.length === 0) {
            console.log("Result is empty or not exist: ", result);
            return;
        } else {
            result.forEach(function (category) {
                all.num += category.num;
            })
            var categories = result;
            categories.unshift(all);
            callback(categories);
        }
    });
}

module.exports.getItems = function (category, page, ITEMS_PER_PAGE, callback) {
    var query = {};
    if (category !== 'All') {
        query = {
            category: category
        }
    }

    var pageItems = [];

    Item
        .find(query)
        .sort({
            _id: 1
        })
        .skip(page * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .exec(function (err, result) {
            assert.equal(err, null);
            if (!result || result.length === 0) {
                console.log('Result is empty or not exist: ', result);
            } else {
                result.forEach(function (item) {
                    pageItems.push(item);
                })
                callback(pageItems);
            }
        })
}

module.exports.getNumItems = function (category, callback) {
    var query = {};
    if (category !== 'All') {
        query = {
            category: category
        }
    }

    Item.find(query, function (err, result) {
        assert.equal(err, null);
        if (!result || result.length === 0) {
            console.log('Result is empty or not exist: ', result);
        } else {
            var numItems = result.length;
            callback(numItems);
        }
    })
}

module.exports.getItem = function (itemId, callback) {
    Item
        .findById(itemId)
        .exec(function (err, result) {
            if (!result) {
                console.log('error at result getItem: ', result);
            } else {
                callback(result);
            }
        })
}

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

module.exports.getNumPage = function (queryString, callback) {
    Item
        .find({
            $text: {
                $search: queryString,
                $caseSensitive: false
            }
        })
        .exec(function (err, result) {
            assert.equal(err, null);
            if (!result) {
                console.log('error result');
                return;
            } else {
                var numItems = result.length;
                callback(numItems);
            }
        })
}