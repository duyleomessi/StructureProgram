var Item = require('../../models/items');
var assert = require('assert');

var itemProcess = function itemProcess() {
    this.getCategories = function (callback) {
        var group = {
            _id: '$category',
            num: {
                $sum: 1
            }
        };
        var sort = {
            _id: 1
        };

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
                });
                var categories = result;
                categories.unshift(all);
                callback(null, categories);
            }
        });
    };

    // get item belong to category
    this.getItems = function (category, page, ITEMS_PER_PAGE, callback) {
        var query = {};
        if (category !== 'All') {
            query = {
                category: category
            };
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
                    });
                    callback(null, pageItems);
                }
            });
    };

    this.getNumItems = function (category, callback) {
        var query = {};
        if (category !== 'All') {
            query = {
                category: category
            };
        }

        Item.find(query, function (err, result) {
            assert.equal(err, null);
            if (!result || result.length === 0) {
                console.log('Result is empty or not exist: ', result);
            } else {
                var numItems = result.length;
                callback(null, numItems);
            }
        });
    };

    this.getItem = function (itemId, callback) {
        Item
            .findById(itemId)
            .exec(function (err, result) {
                if (!result) {
                    console.log('error at result getItem: ', result);
                } else {
                    callback(result);
                }
            });
    };

    this.getNumPage = function (queryString, callback) {
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
            });
    };

    this.searchItems = function (queryString, page, ITEMS_PER_PAGE, callback) {
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

            });
    };
};

itemProcess.instance = null;
itemProcess.getInstance = function () {
    if (this.instance === null) {
        this.instance = new itemProcess();
    }
    return this.instance;
}

module.exports = itemProcess.getInstance();