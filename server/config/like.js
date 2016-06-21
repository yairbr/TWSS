module.exports = function(){

  var express = require('express');
  var router = express.Router();
  var Debrief = require('../models/debrief');
  var mongoose = require('mongoose');

// change here the rout
  router.post('/like', function(req, res, next) {
    var type = "_" + req.type;
    var text = req.text;
    var id = req.id;

    Debrief.update({ '_id' : id, type + '._data' : text }, { '$inc' : { type + '.$._score': 1 }}, callback);  
	  Debrief.findOne({'_id' : debId}, type, function (data){
           if(err){
           	res.status(404).json({
              message: 'Server Failed (debrief not found)'
            });
          } else {
            res.json(data)
          }
    });
  });

  return router;
};

