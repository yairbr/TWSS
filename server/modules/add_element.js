module.exports = function(){
    var Debrief = require('../models/debrief');

    return {
        add_element : function (msg){
            var type = "_" + msg.type;
            var text = msg.text;
            var user = msg.user;
            var debId = msg.debId;
            var tags = [];

            var obj = {
                "_user"  : user,
                "_data"  : text,
                "_tags"  : tags,
                "_score" : 0
            };

            Debrief.findByIdAndUpdate(
                debId,
                {'$push': { type : obj }},
                {safe: true, upsert: true, new : true},
                function(err, data) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.json(data);
                    }
                });
        }
    };
};

