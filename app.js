/*** Module dependencies ***/

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('express-error-handler'),
    morgan = require('morgan'),
    http = require('http'),
    path = require('path');

/*** VARs ***/
var app = express();
var port = 3001;

/*** Configuration ***/

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler());


/*** Routes ***/

app.get('/', function(req,res) {
	res.render('index');
});
app.get('/client', function(req,res) {
	res.render('client');
});
app.get('/partials/:name', function(req,res){
	var name = req.params.name;
	res.render('partials/' + name);
});
// redirect all others to the index (HTML5 history)
app.get('*', function(req,res) {
	res.render('index');
});
// JSON API
app.get('/api/name', function (req, res) {
	res.json({
		name: 'Bob'
	});
});

/*** HTTP Server ***/

app.listen(port, function(){
	console.log('HTTP Server listening on port '+ port);
});
