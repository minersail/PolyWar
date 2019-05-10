var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var dotenv = require('dotenv').config();

if (dotenv.error) {
    throw result.error
}
  
var playerSchemas = require("./schemas/schemas.js"); //Need to change this to MongoDB
var exphbs = require('express-handlebars');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/', //Need to change this.
}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

//Load environment variables


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
//let data = startData.data;
//let idCount = startData.data.length;

app.get('/', function(req, res) {
    res.render('home', {data: [...data]});
});

app.post('/create_user', function(req, res) { //Test Endpoint
    var user = new playerSchemas.User({
        name: req.body.name,
        id: parseInt(req.body.id),
        score: 0,
        password: req.body.password
    });

    user.save(function(err) {
        if(err) throw err
        return res.send("Player saved!")
    })
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port 3000!');
});
