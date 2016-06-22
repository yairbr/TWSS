/**
 * Module dependencies.
 */
var express = require('express');
var passport = require('passport');
var app = express();

module.exports = function(io){
  /**
   * DB configurations
   */ 
  var mongoose = require('mongoose');
  var configDB = require('./config/database.js');
  mongoose.connect(configDB.users_url);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'db connection error'));
  db.once('open', function(){console.log('succefully connected to mongodb');});

  /**
   * Express Middleware of the server
   */ 
  require('./middleware')(app, express, passport);

  /**
   * Routes of the server + Ajax API
   */ 
  require('./routes/routes')(app, passport, io);

  /**
  * Error handlers the server
  */ 
  require('./server_critic_error_handlers').handleerror(app);

  return app;
};