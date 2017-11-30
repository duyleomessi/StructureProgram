'use strict';

var assert = require('assert');
var express = require('express');
var indexRoute = express.Router();


var async = require('async');
var Item = require('../models/items');

var itemProcess = require('./singleton/itemProcess');

/* GET home page. */
indexRoute.get('/', function (req, res, next) {
    if (req.user)
        console.log('user', req.user._id);
    var category = req.query.category ? req.query.category : 'All';
    var page = req.query.page ? req.query.page : 0;
    var ITEMS_PER_PAGE = 5;

    async.series([
        function (callback) {
            itemProcess.getCategories(callback)
        },
        function (callback) {
            itemProcess.getItems(category, page, ITEMS_PER_PAGE, callback)
        },
        function (callback) {
            itemProcess.getNumItems(category, callback)
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
        } else {

            var categories = result[0];
            var pageItems = result[1];
            var itemCount = result[2];
            var numPages = 0;
            if (itemCount > ITEMS_PER_PAGE) {
                numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
            }

            var data = {
                category_param: category,
                categories: categories,
                useRangeBasedPagination: false,
                itemCount: itemCount,
                pages: numPages,
                page: page,
                items: pageItems
            }
            res.render('home', data);
        }
    })


    // itemProcess.getCategories(function (categories) {
    //     itemProcess.getItems(category, page, ITEMS_PER_PAGE, function (pageItems) {
    //         itemProcess.getNumItems(category, function (itemCount) {
    //             var numPages = 0;
    //             if (itemCount > ITEMS_PER_PAGE) {
    //                 numPages = Math.ceil(itemCount / ITEMS_PER_PAGE);
    //             }

    //             res.render('home', {
    //                 category_param: category,
    //                 categories: categories,
    //                 useRangeBasedPagination: false,
    //                 itemCount: itemCount,
    //                 pages: numPages,
    //                 page: page,
    //                 items: pageItems
    //             });
    //         })
    //     })
    // })


})
module.exports = indexRoute;