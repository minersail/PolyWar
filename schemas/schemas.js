var mongoose = require('mongoose');

var user = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        dropDups: true,
        trim: true,
    },
    score: {
        type: Number
    },
    password: {
        type: String
    },
});

var squadron = new mongoose.Schema({
    name: {
        type: String
    },
    author: {
        type: String
    },
    units: {
        type: [Number]
    }, 
    wins: {
        type: Number
    }
})

var battle = new mongoose.Schema({
    squad1: {
        type: String,
    },
    squad2: {
        type: String,
    },
})

var User = mongoose.model('User', user);
var Squadron = mongoose.model('Squadron', squadron);
var Battle = mongoose.model('Battle', battle);

module.exports = {
    User: User,
    Squadron: Squadron,
    Battle: Battle,
    //Comments: Comments
}

// module.exports.User = User;
// module.exports.Squadron = Squadron;
// module.exports.Battle = Battle;
// module.exports.Comments = Comments;