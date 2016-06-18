var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
	local: {
    _id : ObjectId,
    _cluster : Number,
    _user : String,
	_title : {   _user : String,
		_data : String,
		_tags : [ String ],
		_score : Number},
	_what : {   _user : String,
		_data : String,
		_tags : [ String ],
		_score : Number},
    _whys: [{   _user : String,
		_data : String,
		_tags : [ String ],
		_score : Number}],
    _facts: [{   _user : String,
		_data : String,
		_tags : [ String ],
		_score : Number}],
    _learnings: [{   _user : String,
		_data : String,
		_tags : [ String ],
		_score : Number}]
	_ranking : Mixed;
	}
});

module.exports = mongoose.model('Debrief', userScheme);