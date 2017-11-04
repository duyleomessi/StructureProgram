'use strict';

var assert = require('assert');
var express = require('express');
var indexRoute = express.Router();

var async = require('async');

var Item = require('../models/items');



/* GET home page. */
indexRoute.get('/', function (req, res, next) {
    if (req.user)
        console.log('user', req.user._id);
    var category = req.query.category ? req.query.category : 'All';
    var page = req.query.page ? req.query.page : 0;
    var ITEMS_PER_PAGE = 5;

    Item.getCategories(function (categories) {
        Item.getItems(category, page, ITEMS_PER_PAGE, function (pageItems) {
            Item.getNumItems(category, function (itemCount) {
                var numPages = 0;
                if (itemCount > ITEMS_PER_PAGE) {
                    numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
                }

                res.render('home', {
                    category_param: category,
                    categories: categories,
                    useRangeBasedPagination: false,
                    itemCount: itemCount,
                    pages: numPages,
                    page: page,
                    items: pageItems
                });
            })
        })
    })
})
module.exports = indexRoute;
