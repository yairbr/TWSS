var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
	_id : String,
	_email : String,
	_domain : String,
	_password : String,
	_groups : [ String ],
	_roles : [ String ] ,
	_firstname : String,
	_lastname : String,
	_rating : Number ,
	_debriefCounter : Number,
	_debrief : [ String ],
	_debriefShared : [ String ],
	_phone : String,
	_photo : String,
	_listAssigned : [ String ],
	_listCreated : [ String ],
	_quickLearning : String,
	_publishedDebriefs : mongoose.Schema.Types.Mixed,
	_notifications: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('User', userScheme);