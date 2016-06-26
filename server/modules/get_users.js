module.exports = function() {

    var User = require('../models/user');

    return {
        getUsersWithRating : function (usersWithRanks) {
            var users = usersWithRanks.map(function(u) {return u.user;});
            User.find({'_id': {'$in': users}}, {'_id': 1, '_rating': 1}).exec(function (err, data) {
                if (err) {
                    res.status(404).json({
                        message: 'Server Failed (debrief not found)'
                    });
                } else {
                    usersWithRanks.forEach(function(user){
                        data.forEach(function(user1){
                            if(user.user === user1._id){
                                user.rating = user1._rating;
                                console.log(user1._rating);
                            }
                        });
                    });
                    return usersWithRanks;
                }
            });
        }
    };
};
