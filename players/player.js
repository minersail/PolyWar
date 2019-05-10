var mongoose = require('mongoose');

var player = new mongoose.Schema({
    wins: {
        type: Number,
        required: true
    },
    losses: {
        type: Number,
        required: true
    },
    ties: {
        type: Number,
        required: true
    },
    name: {
        type: String
    },
    date: {
        type: String
    },
    author: {
        type: String
    },
    lineup: [String]
});

/*
var movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        min: 0,
        max: 2019,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    reviews: [reviewSchema]
});
*/
var Player = mongoose.model('Player', player);

module.exports = Player;
