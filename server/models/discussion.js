var mongoose = require('mongoose');

var discussionScheme = mongoose.Schema({
	title: String,
	description: String,
	forStudents: Boolean,
	forInstructors: Boolean
});

module.exports = mongoose.model('Discussion', discussionScheme);