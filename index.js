var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require("underscore");
var dotenv = require('dotenv').config();
if (dotenv.error) {
    throw result.error
}

var exphbs = require('express-handlebars');
var logger = require('morgan');
var app = express();

var playerSchemas = require("./schemas/schemas.js"); //Need to change this to MongoDB
var encrypter = require("./password_handler.js")


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/', //Need to change this.
}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

//MongoDB Setup/Connection
console.log(process.env.MONGODB)
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true});
mongoose.connection.on('error', function(e) {
    console.log(e);
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});



/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/', function(req, res) {
    res.render('home', {});
});

//Allow the user to create their own profile
app.post('/api/create_profile', function(req, res) { 

    //Need to figure out how to prevent duplicate usernames!!!!

    var salt = encrypter.salt(parseInt(req.body.id))
    var hash = encrypter.hash(req.body.password, salt);

    var user = new playerSchemas.User({
        name: req.body.name.trim(),
        id: Math.floor(Math.random() * 999999999), //Random id
        score: 0,
        password: hash
    });

    if(!encrypter.validate(req.body.password, hash))
    {
        return res.send("Password authentication error")
    }

    user.save(function(err) {
        if(err) throw err
        return res.send("Player saved! Your id is: " + parseInt(user.id))
    })
})

//Gets the users involved and checks their passwords
app.get('/api/get_user/:user', function(req, res) {
    playerSchemas.User.findOne({name: req.params.user}, 'name score', function(err, user) {
        if(err) throw err
        if(user != null)
            return res.send(user)
        else
            return res.send("No user found!")
    });
})

//Deletes the user with the specified username and password
app.delete("/api/delete_user", function(req, res){
    playerSchemas.User.findOneAndDelete({name: req.body.user}, function(err, user) {
        if(err) throw err
        if(user != null && encrypter.validate(req.body.password, user.password))
            return res.delete(user)
        else
            return res.send("No user found!")
    });
}) 


//Allows you to create the squadron based on the thingys
app.post('/api/create_squadron', function(req, res) {
    var setup = req.body.units.split("/^(\d+,){0,11}\d+$/")
    setup = _.reduce(setup, function(memo, num){ 
        if(memo.length < 12)
        {
            if(parseInt(num) != null) 
                memo.push(parseInt(num)) 
            else
                memo.push(0)
        }
    }, []); //Converts your input into the units and then pushes 0's by default for dirty/unclean data

    var squadron = new mongoose.Schema({
        name: req.body.name,
        author: parseInt(req.body.id), 
        units: setup,
        wins: 0
    })

    squadron.save(function(err) {
        if(err) throw err
        return res.send("Squadron saved!")
    })
})

//Allows you to select the squadron based on id
app.get('/api/squadron/:id/', function(req, res) {
    playerSchemas.Squadron.find({id: req.body.id}, function(err, squad) {
        if(err) throw err
        if(user != null && squad.id == parseInt(req.body.id))
            return res.send(squad)
        else
            return res.send("No user found!")
    });
})

//Deletes name based on your squads name and ID (i.e. squad id)
app.delete('/api/delete_squadron', function(req, res) {
    playerSchemas.Squadron.findOneAndDelete({name: req.body.name, id: req.body.id}, function(err, squad) {
        if(err) throw err
        if(squad != null && squad.name == req.body.name && squad.id == parseInt(req.body.id))
            return res.delete(squad)
        else
            return res.send("No squad found!")
    });
})

app.get("/battles", function(req, res) {
    playerSchemas.Squadron.find({}, function(err, battle) {
        if(err) throw err
        return res.send(battle)
    });
})

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port 3000!');
});
