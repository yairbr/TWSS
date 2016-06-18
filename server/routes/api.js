module.exports = function(){

  // var Debrief = require('../models/debrief');
  // var Argument = require('../models/argument')(autoIncrement);
  var express = require('express');
  var router = express.Router();

  //TODO: DEFINE all our AJAX api calls


/*
  router.get('/discussions', function(req, res, next) {
    if (req.user.local.role === "admin"){
        Discussion.find({}, function(err, data){
        res.json(data);
      });
    }
    else if (req.user.local.role === "student"){
        Discussion.find({forStudents: true}, function(err, data){
        res.json(data);
      });
    }
    else{
        Discussion.find({forInstructors: true}, function(err, data){
        res.json(data);
      });
    }
    
  });
*/
  return router;

};

