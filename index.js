//** Requires 
var express = require('express');


//Express
var app = express();
var router = express.Router();


//Static Files
app.use('/', express.static(__dirname + '/'));


//Router
app.get('/', function(req, res, next) {
    res.send('ok');
});


//Handle 404
app.use(function(req, res, next) {
    res.status(404).send("Could not find page..");
});


//App Listener
app.set('port', '81');
var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
  console.log(`App listening on port ${app.get('port')}`);
})



