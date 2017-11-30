
var assert = require('assert');
var express = require('express');
var itemApi = express.Router();

var async = require('async');
var Item = require('../models/items');

itemApi.get('/getAllItems', function(req, res, next) {
   Item
    .find() 
    .exec(function(err, data) {
        if(err) 
            return res.status(500).json({message: "Error in database process"});
        res.status(200).json(data)
    })
});

itemApi.get('/getAllCategory', function(req, res, next) {
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
            return res.status(200).json(categories);
        }
    });
});

itemApi.get('/item/:itemId', function(req, res, next) {
    Item.findById(req.params.itemId)
        .exec(function(err, data){
            if(err) {
                return res.status(404).json({message: "Not found"});
            }
            return res.status(200).json(data);
        })
});

module.exports  = itemApi;