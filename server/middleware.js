/**
 * Module dependencies.
 */
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

module.exports = function(app, express, passport){

  /**
   * AUTHENTICATION 
   *    using Passport configuration - Strategies
   */
  require('./config/passport')(passport);
  
  // create application/json parser
  var jsonParser = bodyParser.json();
  // create application/x-www-form-urlencoded parser
  var urlencodedParser = bodyParser.urlencoded({ extended: false });

  app.use(logger('dev'));
  app.use(urlencodedParser);
  app.use(jsonParser);

  app.use(session({
    secret: 'veryverysecretshit',
    saveUninitialized: true,
    resave: true, // 
    cookie: {maxAge: 3600000} //one hour
  }));


  app.use(passport.initialize()); 
  app.use(passport.session());// uses the same session from express
  app.use(flash());
  //TODO: save the sessions in the database

  app.use(express.static(path.resolve(__dirname, '..', 'client')));

  // view engine setup
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, '..', 'client', 'views'));
};