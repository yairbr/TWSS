var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	//TODO: serialize with the role! maybe play with express-session stuff...

	passport.use('local-register', new LocalStrategy({
			//the names of the fields in the POST body to the server are default: username, password (the primary ones). TO PAY ATTENTION
			passReqToCallback: true
		},
		function(req, username, password, done){
			process.nextTick(function(){
				User.findOne({'username':username}, function(err, user){
					if (err){
						return done(err);
					}
					if (user){
						return done(null, false, req.flash('registerMessage', 'That username is already taken'));
					}else{
						var newUser = new User();
						newUser._id = username;
						newUser._password = password;
						newUser._firstname = req.body.fname;
						newUser._lastname = req.body.lname;

						newUser.save(function(err){
							if (err){
								throw err;
							}else{
								return done(null, newUser);
							}
						});
					}
				});
			});
		}));

	passport.use('local-login', new LocalStrategy({
			//the names of the fields in the POST body to the server are default: username, password (the primary ones). TO PAY ATTENTION
			passReqToCallback: true
		},
		function(req, username, password, done){
			process.nextTick(function(){
				// console.log('args: ', username, '\n', password, '\n', req);
				User.findOne({'_id':username}, function(err, user){
					if (err){
						return done(err);
					}
					if (!user){
						return done(null, false, req.flash('loginMessage', 'Invalid Username!'));
					}if(user._password !== password){
						return done(null, false, req.flash('loginMessage', 'Invalid Password!'));
					}
					return done(null, user);
				});
			});
		}));
};