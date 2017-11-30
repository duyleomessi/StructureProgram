var express = require('express');
var searchRoute = express.Router();

var Item = require('./singleton/itemProcess');

searchRoute.get('/', function (req, res, next) {
    var queryString = req.query.query;
    var page = req.query.page ? req.query.page : 0;

    var ITEMS_PER_PAGE = 5;

    Item.searchItems(queryString, page, ITEMS_PER_PAGE, function (items) {
        Item.getNumPage(queryString, function (itemCount) {
            var pages = 0;
            if (itemCount > ITEMS_PER_PAGE) {
                pages = Math.ceil(itemCount / ITEMS_PER_PAGE);
            }
            
            res.render('search', {
                queryString: queryString,
                items: items,
                pages: pages,
                itemCount: itemCount
            });
        })
    })

})

module.exports = searchRoute;