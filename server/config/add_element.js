module.exports = function(){
  var express = require('express');
  var router = express.Router();
  var Debrief = require('../models/debrief');
  var mongoose = require('mongoose');

// change here the rout
  router.post('/add_element', function(req, res, next) {
    var type = "_" + req.type;
    var text = req.text;
    var user = req.user;
    var id = req.id;
    var tags = [];

    var obj = {
      "_user"  : user,
      "_data"  : text,
      "_tags"  : tags,
      "_score" : 0
    };

    Debrief.findByIdAndUpdate(
      id,
      {'$push': {type: obj }},
      {safe: true, upsert: true, new : true},
      function(err, data) {
        if(err){
          console.log(err);
        }
        else{
          res.json(data);
        }
      });
  });

  return router;

};

