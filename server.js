require('dotenv').config();

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var path = require('path');
app.use(express.static(path.join(__dirname)+"/static"));

// *** flash *** //
var flash = require('express-flash');
var cookieParser = require('cookie-parser')
app.use(cookieParser())
var cookieSession = require('cookie-session')
app.use(cookieSession({
	name: 'session',
	keys: [process.env.SESSIONKEY],	
	maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}));
app.use(flash());

// *** view engine *** //
var swig = require('swig');
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// *** routes *** /
var routes = require('./config/routes.js')(app);

var port = 8000;
var server = app.listen(port, () => {
	console.log('[HackDojo] listening at: localhost:'+port);
});



