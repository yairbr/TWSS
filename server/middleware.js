/**
 * Module dependencies.
 */
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
// var passportSocketIo = require("passport.socketio");

module.exports = function(app, express, passport, mongoose, io){

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

    var sessionMiddleware = session({
        secret: 'very-very-secret-shit',
        saveUninitialized: true,
        resave: false, //
        cookie: {maxAge: 3600000}, //one hour
        store: new MongoStore( {mongooseConnection: mongoose.connection} )
    });

    app.use(sessionMiddleware);


    app.use(passport.initialize());
    app.use(passport.session());// uses the same session from express
    app.use(flash());
    //TODO: save the sessions in the database

    // app.use(function(req, res, next){
    //     console.log(req.session);
    //     console.log('*********************');
    //     console.log(req.user);
    //     next();
    // });

    io.use(function(socket, next){
        // Wrap the express middleware
        sessionMiddleware(socket.request, {}, next);
    });

    app.use(express.static(path.resolve(__dirname, '..', 'client')));

    // view engine setup
    app.set('view engine', 'ejs');
    app.set('views', path.resolve(__dirname, '..', 'client', 'views'));
};