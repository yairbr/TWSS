module.exports = function() {

	var Debrief = require('../models/debrief');
	var User = require('../models/user');

	var calc_score = function (score_obj) {
		if (!score_obj.rating || score_obj.rating == 0)
			score_obj.rating = 1;
		if (!score_obj.ranking || score_obj.ranking == 0)
			score_obj.ranking = 1
		var numerator = ((score_obj.scoring + 1) * score_obj.ranking * score_obj.rating);
		var denominator = (score_obj.scoring + score_obj.ranking + score_obj.rating);
		return numerator / denominator;
	};


	return {
		sort : function (msg) {
			var type = "_" + msg.type + "s";
			var debId = msg.id;


			var deb;
			Debrief.findOne({'_id': debId}, '_ranking ' + type, function (data) {
				if (err) {
					res.status(404).json({
						message: 'Server Failed (debrief not found)'
					});
				} else {
					deb = data
				}
			});

			var users = [];
			type_arr.forEach(function (element) {
				users.push(element._user);
			});

			User.find({'_id': {'$in': users}}, {'_id': 1, '_rating': 1}).exec(function (err, data) {
				if (err) {
					res.status(404).json({
						message: 'Server Failed (debrief not found)'
					});
				} else {
					users = data;
				}
			});

			var elements = deb[type];
			var objs = [];
			elements.forEach(function (element) {
				var username = element._user;
				var obj;
				obj.data = element._data;
				obj.scoring = element._score
				obj.ranking = deb._ranking[username];
				obj.rating = element._score;
				objs.push(obj);
			});

			objs.sort(function (a, b) {
				return (calc_score(a) > calc_score(b)) ? 1 : ((calc_score(b) > calc_score(a)) ? -1 : 0);
			});

			var ans = [];
			objs.forEach(function (element) {
				ans.push(element.data);
			});

			return ans;
		}
	};
};
