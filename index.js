var express = require('express');
var session = require('express-session');
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

var playerSchemas = require("./schemas/schemas.js");
var encrypter = require("./password_handler.js");
var shapeCreator = require("./public/js/shapeCreator.js");

//Sockets
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Set up Handlebars
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'XASDASDA'}));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        "createThumbnail": shapeCreator.createThumbnail,
    }
}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

let db;
//MongoDB Setup/Connection
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true}).then((res) => {
    db = res;
});
mongoose.connection.on('error', function(e) {
    console.log(e);
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

//This is an event listener for sockets
io.on('connection', function(socket) {
    socket.on('new squadron', function(msg) {
        console.log('Squadron Created');
        io.emit('new squadron', msg);
    });
    socket.on('edit squadron', function(msg) {
        console.log('Edit Squadron');
        io.emit('edit squadron', msg);
    });
    socket.on('delete squadron', function(msg) {
        console.log('Squadron Deleted');
        io.emit('delete squadron', msg);
    });
});



/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.get('/', function(req, res) {
    /*if (!req.session.userID) {
        return res.redirect("/login");
    }*/
    return res.render('home', {userID: req.session.userID});
});

app.get('/logout', function(req, res) {
    req.session.userID = "";
    //console.log("Logged out: " + req.session.userID)
    return res.redirect('/');
})

//Allow the user to create their own profile
app.post('/api/create_user', function(req, res) {
    let hash = encrypter.hash(req.body.password, 10);

    var user = new playerSchemas.User({
        username: req.body.username,
        score: 0,
        password: hash,
    });

    user.save(function(err, ret) {
        if (err) {
            return res.send({ error: true, errorText: "Username already exists."});
        }
        req.session.userID = ret._id;
        return res.send({ error: false });
    });
});

//Allow the user to create their own profile
app.post('/api/login', function(req, res) {
    playerSchemas.User.findOne({username: req.body.username}, "_id password", (err, user) => {
        if (err || user === null) {
            return res.send({ error: true, errorText: "Username does not exist."} );
        }

        let userID = user._id;
        let hash = user.password;    

        if(!encrypter.validate(req.body.password, hash)) {
            return res.send({ error: true, errorText: "Password is incorrect." });
        }
        
        req.session.userID = userID;
        return res.send({ error: false });
    });
});

//Gets the users involved and checks their passwords
app.get('/api/get_user/:user', function(req, res) {
    playerSchemas.User.findOne({name: req.params.user}, 'name score', function(err, user) {
        if(err) throw err
        if(user != null)
            return res.send(user)
        else
            return res.send("No user found!")
    });
});

//Deletes the user with the specified username and password
app.delete("/api/delete_user", function(req, res){
    playerSchemas.User.findOneAndDelete({name: req.body.user}, function(err, user) {
        if(err) throw err
        if(user != null && encrypter.validate(req.body.password, user.password))
            return res.delete(user)
        else
            return res.send("No user found!")
    });
});

app.post('/api/create_squadron', function(req, res) {
    let units = req.body.units.split(",").map(x => parseInt(x));

    var squadron = new playerSchemas.Squadron({
        name: req.body.name,
        author: req.session.userID,
        units: units,
        wins: 0
    })

    squadron.save(function(err, ret) {
        if(err) throw err
        io.emit("new squadron", squadron);
        return res.send(ret._id);
    });
});

app.post('/api/edit_squadron', function(req, res) {
    playerSchemas.Squadron.findById(req.body.id, (err, squad) => {
        if (err) throw err;

        if (squad.author !== req.session.userID) {
            return res.send("Not authorized.");
        }
    
        const units = req.body.units.split(",").map(x => parseInt(x));
    
        playerSchemas.Squadron.findByIdAndUpdate(req.body.id, { 
            units: units,
            name: req.body.name,
        }, (err, ret) => {
            if (err) throw err
            io.emit("edit squadron", squad);
            return res.send({ error: false });
        });
    });
});

app.get('/api/squadron/:id/', function(req, res) {
    playerSchemas.Squadron.find({id: req.body.id}, function(err, squad) {
        if(err) throw err
        if(user != null && squad.id == parseInt(req.body.id))
            return res.send(squad)
        else
            return res.send("No user found!")
    });
});

//Deletes name based on your squads name and ID (i.e. squad id)
app.delete('/api/delete_squadron', function(req, res) {
    playerSchemas.Squadron.findOneAndDelete({name: req.body.name, id: req.body.id}, function(err, squad) {
        if(err) throw err
        if(squad != null && squad.name == req.body.name && squad.id == parseInt(req.body.id))
        {
            io.emit("delete squadron", squad);
            return res.delete(squad)
        }
        else
            return res.send("No squad found!")
    });
});

app.post("/api/createBattle", function(req, res) {
    const battle = new playerSchemas.Battle({
        squad1: req.body.squad1,
        squad2: req.body.squad2,
    });

    battle.save(function(err, ret) {
        if (err) throw err;

        return res.send(ret._id);
    })    
});

app.get("/battles", function(req, res) {
    playerSchemas.Battle.find({}, function(err, battle) {
        if(err) throw err;

        return res.send(battle);
    });
});

app.get("/battle/:id", function(req, res) {
    playerSchemas.Battle.findById(req.params.id, (err, battle) => {
        if(err) throw err;
        if (battle == null) res.send("Battle not found.");

        playerSchemas.Squadron.findById(battle.squad1, (err, squad1) => {
            if (err) throw err;
            if (squad1 == null) res.send("Squadron not found.");
            
            playerSchemas.Squadron.findById(battle.squad2, (err, squad2) => {
                if (err) throw err;
                if (squad2 == null) res.send("Squadron not found.");

                return res.render("battle", {
                    squad1: squad1.units.join(","),
                    squad2: squad2.units.join(","),
                });
            });
        });
    });
});

app.get("/editTeam/:id", function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/login");
    }

    playerSchemas.Squadron.findById(req.params.id, (err, squad) => {
        if (req.session.userID !== squad.author) {
            return res.send("Access denied.");
        }

        return res.render("editTeam", { 
            userID: req.session.userID, 
            units: squad.units,
            name: squad.name,
        });
    });
});

app.get("/viewTeam/:id", function(req, res) {
    playerSchemas.Squadron.findById(req.params.id, (err, squad) => {
        if (err) throw err;
        if (squad === null) return res.send("Squad not found.");

        playerSchemas.User.findById(squad.author, (err, author) => {
            if (err) throw err;

            return res.render("viewTeam", { 
                userID: req.session.userID,
                units: squad.units,
                author: author.username,
                name: squad.name,
                mine: squad.author === req.session.userID,
            });
        });
    });
});

app.get("/viewSquadrons/:id", function(req, res) {
    playerSchemas.User.findById(req.params.id, (err, author) => {
        if (err) throw err;
        if (author === null) return res.send("User not found.");

        playerSchemas.Squadron.find({author: req.params.id}, (err, squad) => {
            if (err) throw err;

            return res.render("squadrons", { 
                userID: req.session.userID,
                squadrons: squad,
                author: author.username,
            });
        });
    })
});

app.get("/battleSelect/:id", function(req, res) {
    if (!req.session.userID) {
        return res.redirect("/login");
    }

    playerSchemas.Squadron.findById(req.params.id, (err, squad) => {
        if (err) throw err;
        if (squad === null) return res.send("Squad not found.");

        playerSchemas.User.findById(squad.author, (err, opponent) => {
            if (err) throw err;
                    
            playerSchemas.Squadron.find({author: req.session.userID}, (err, squadrons) => {
                if (err) throw err;
    
                return res.render("battleSelect", { 
                    userID: req.session.userID,
                    squadrons: squadrons,
                    opponent: opponent.username,
                    opponentID: req.params.id,
                    units: squad.units,
                    name: squad.name,
                });
            });
        });
    });
});

app.get("/login", function(req, res) {
    return res.render("login", {});
});

app.get("/about", function(req, res) {
    return res.render("about", {});
});

http.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port 3000!');
});
