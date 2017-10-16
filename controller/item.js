var express = require('express');
var itemRoute = express.Router();
var Item = require('../models/items');


itemRoute.get('/:itemId', function (req, res, next) {
    var itemId = req.params.itemId;
    Item.getItem(itemId, function (item) {
        if (item === null) {
            res.status(400).send('Items not found');
            return;
        }

        var stars = 0;
        var numReviews = 0;
        reviews = [];

        if ('reviews' in item) {
            numReviews = item.reviews.length;

            item.reviews.forEach(function (review) {
                stars += review.stars;
            })

            if (numReviews > 0) {
                stars = stars / numReviews;
                reviews = item.reviews;
            }
        }

        Item.getRelatedItems(item.category, function (relatedItems) {
            res.render('item', {
                item: item,
                stars: stars,
                reviews: reviews,
                numReviews: numReviews,
                relatedItems: relatedItems
            });
        })
    });
});

itemRoute.post("/:itemId/reviews", function(req, res, next) {
    var itemId = req.params.itemId;
    var review = req.body.review;
    var name = req.body.name;
    var stars = req.body.stars;

    Item.addReview(itemId, review, name, stars, function() {
        res.redirect('/item/' + itemId);
    })

})

module.exports = itemRoute;