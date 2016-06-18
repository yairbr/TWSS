var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
	username: String,
	password: String,
	firstname: String,
	lastname: String
});

module.exports = mongoose.model('User', userScheme);