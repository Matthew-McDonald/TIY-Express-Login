//REQUIREMENTS
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const data = require('./userData.js');

const app = express();

//Connecting mustache-express to the app engine and linking it to the views folder
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//Tells app to use the body-parser module for json files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//'extended: false' parses strings and arrays.
//'extended: true' parses nested objects

//Setting up the session data
app.use(session({
  secret: 'butter churner',
  resave: false,
  saveUninitialized: true
}));

//authenticate function to check if the content in the username matches the content in the login.mustache
function authenticate (req, username, password) {
  var authenticatedUser = data.users.find (function (user) {
    if (username === user.username && password === user.password) {
      req.session.authenticated = true;
      console.log('User confirmed');
    } else {
      return false;
    }
    //checks to see if the values match
    console.log(req.session);
    return req.session;
  })
}
//prints the index.mustache file to the page if there is a current session and its authenticated, if it's not, it redirects you to the login page
app.get('/', function (req, res) {
  if (req.session && req.session.authenticated) {
  res.render('index');
} else {
  res.redirect('/login');
}
})
//request for the server to pull the value entered in the username and password and send it through the authenticate function, then tells it where to redirect
app.post('/', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  authenticate(req, username, password);
  if (req.session && req.session.authenticated) {
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});
//establishes the /login page
app.get('/login', function (req, res) {
  res.render('login');
})

//listens for the app and the port 3000
app.listen(3000, function(){
  console.log('Started express application!')
});
