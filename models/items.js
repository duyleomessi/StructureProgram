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

itemSchema.index({ title: 'text', description: 'text', slogan: 'text' });

var Item = module.exports = mongoose.model('Item', itemSchema);

module.exports.getCategories = function (callback) {
    var group = {
        _id: '$category',
        num: { $sum: 1 }
    }
    var sort = {
        _id: 1
    }

    Item.aggregate([
        { $group: group },
        { $sort: sort },
    ], function (err, result) {
        assert.equal(err, null);
        var all = { _id: 'All', num: 0 };
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
        .sort({ _id: 1 })
        .skip(page * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .exec(function (err, result) {
            assert.equal(err, null);
            if (!result || result.length === 0) {
                console.log('Result is empty or not exist: ', result);
            }
            else {
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
        }
        else {
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
    var query = { category: category };
    Item
        .find(query)
        .limit(4)
        .exec(function (err, result) {
            assert.equal(err, null);
            if (!result || result.length === 0) {
                console.log('error at result: ', result);
                return;
            } else {
                /*var relatedItems = [];
                if (result.length > 4) {
                    var arr = [];
                    for (var i = 0; i < 4; i++) {
                        arr[i] = Math.floor(Math.random() * result.length);
                        console.log("arr ", i, arr[i]);

                        for (var j = 0; j < i; j++) {
                            if (arr[i] === arr[j]) {
                                console.log('change');
                                arr[i] = Math.floor(Math.random() * result.length);
                                console.log("arr ", i, arr[i]);
                                j--;
                            }
                        }
                        relatedItems.push(result[i]);
                    }
                }*/
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
        .update({ _id: itemId }, { $push: { reviews: newReview } })
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
        .sort({ _id: 1 })
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

/*function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function (callback) {
        "use strict";

        var query = [{
            $group: {
                _id: '$category',
                num: {$sum: 1}
            }
        },
            {
                $sort: {
                    '_id': 1
                }
            }];


        // solution 1 use cursor
        //  var categories = [];

        //  var category = database.collection('item').aggregate(query);

        //  category.forEach(function (doc) {
        //  categories.push(doc);
        //  }, function (err) {
        //  assert.equal(null, err);
        //  callback(categories);
        //  });


        // solution 2 use toArray method

        this.db.collection('item').aggregate(query).toArray(function (err, result) {
            assert.equal(err, null);
            var all = {_id: 'All', num: 0};
            result.forEach(function (element) {
                all.num += element.num;
            })

            var categories = result;
            categories.unshift(all);
            callback(categories);
        });
    }


    this.getItems = function (category, page, itemsPerPage, callback) {
        "use strict";

        var query = {};
        if (category !== 'All') {
            query = {
                'category': category
            }
        }
        ;

        var pageItems = [];
        var n = 0;
        var items = this.db.collection('item').find(query).sort({_id: 1}).skip(page * itemsPerPage).limit(itemsPerPage);
        items.toArray(function (err, result) {
            if (result.length < itemsPerPage) {
                itemsPerPage = result.length;
            }

            for (var i = 0; i < itemsPerPage; i++) {
                pageItems.push(result[i]);
            }

            callback(pageItems);

        })
    }


    this.getNumItems = function (category, callback) {
        "use strict";

        var numItems = 0;

        var query = {};

        if (category !== 'All') {
            query = {
                'category': category
            }

        }


        this.db.collection('item').find(query).toArray(function (err, result) {
            numItems += result.length;
            callback(numItems);
        });
    }


    this.searchItems = function (query, page, itemsPerPage, callback) {
        "use strict";

        var queryIndex = {
            $text: {
                $search: query,
                $caseSensitive: false

            }
        }

        var items = [];

        var textSearch = this.db.collection('item').find(queryIndex).sort({_id: 1}).skip(itemsPerPage * page).limit(itemsPerPage);
        textSearch.toArray(function (err, result) {

            if (result.length < itemsPerPage) {
                itemsPerPage = result.length;
            }

            for (var i = 0; i < itemsPerPage; i++) {
                assert.equal(err, null);
                items.push(result[i]);
            }

            callback(items);

        })
    }


    this.getNumSearchItems = function (query, callback) {
        "use strict";

        var numItems = 0;

        var queryIndex = {
            $text: {
                $search: query,
                $caseSensitive: false
            }
        }

        var textSearch = this.db.collection('item').find(queryIndex);
        textSearch.toArray(function (err, result) {
            numItems += result.length;
            callback(numItems);
        })
    }


    this.getItem = function (itemId, callback) {
        "use strict";

        var item = {};

        var query = {
            '_id': itemId
        };

        this.db.collection('item').find(query).toArray(function (err, result) {
            item = result[0];
            callback(item);
        })
    }


    this.getRelatedItems = function (callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function (err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function (itemId, comment, name, stars, callback) {
        "use strict";

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        var doc = {};
        this.db.collection('item').update({_id: itemId}, {$push: {reviews: reviewDoc}});
        console.log('udate completely');

        this.db.collection('item').find({_id: itemId}).toArray(function (err, result) {
            assert.equal(err, null);
            console.log('resutl');
            console.log(result);
            doc = result[0];
            console.log('doc');
            console.log(doc)
            callback(doc);
        });
    }
}*/



