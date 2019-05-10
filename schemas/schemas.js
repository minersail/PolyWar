var mongoose = require('mongoose');

var user = new mongoose.Schema({
    name: {
        type: String
    },
    id: {
        type: Number
    },
    score: {
        type: Number
    },
    password: {
        type: String
    }
});

var squadron = new mongoose.Schema({
    name: {
        type: String
    },
    author: {
        type: Number
    },
    units: {
        type: [Number]
    }, 
    wins: {
        type: Number
    }
})

var battle = new mongoose.Schema({
    home_team: {
        type: Number
    },
    away_team: {
        type: Number
    },
    comments: [comments]
})

var comments = new mongoose.Schema({
    id: {
        type: Number
    },
    message: {
        type: String
    },
    author: {
        type: Number
    },
    timestamp: {
        type: String
    }
})

var User = mongoose.model('User', user);
var Squadron = mongoose.model('Squadron', squadron);
var Battle = mongoose.model('Battle', battle);
var Comments = mongoose.model('Comment', comments);

module.exports = {
    User: User,
    Squadron: Squadron,
    Battle: Battle,
    Comments: Comments
}

// module.exports.User = User;
// module.exports.Squadron = Squadron;
// module.exports.Battle = Battle;
// module.exports.Comments = Comments;