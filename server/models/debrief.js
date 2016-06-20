var mongoose = require('mongoose');

var debriefScheme = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	_cluster : Number,
	_user : String,
	_title : {   
		_user : String,
		_data : String,
		_tags : [ String ],
		_score : Number
	},
	_what : {   
		_user : String,
		_data : String,
		_tags : [ String ],
		_score : Number
	},
	_whys: 
		[{
			_user : String,
			_data : String,
			_tags : [ String ],
			_score : Number
		}],
	_facts: 
		[{   
			_user : String,
			_data : String,
			_tags : [ String ],
			_score : Number
		}],
	_learnings: 
		[{   
			_user : String,
			_data : String,
			_tags : [ String ],
			_score : Number
		}],
	_ranking : mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Debrief', debriefScheme);