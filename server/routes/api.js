module.exports = function(io){

  var express = require('express');
  var router = express.Router();
  var recommendationEngine = require('../config/recommendationEngine')('127.0.0.1', 5000);
  var Debrief = require('../models/debrief');
  var mongoose = require('mongoose');
  var async = require('async');

  /* Real-Time */

  io.on('connection', function(socket){
    console.log('user connected!');

    socket.on('disconnect', function(){
      console.log('a user disconnected!');
    });
  });



  router.post('/recommend/title', function(req, res, next) {
    var recommendReq = {
      "messageId" : "1", //TODO: should be deprecated
      "req_type" : "TITLE",
      "text" : req.body.text,
      "userId" : req.user._id,
      "tags" : req.body.tags
    };

    recommendationEngine.getRecommendations(recommendReq)
    .then(
      function success(data){
        var debriefIds = data.debriefs;
        var debriefIdsAndTitles = [];
        debriefIds.forEach(function(id, idx){debriefIds[idx] = mongoose.Types.ObjectId(id);});

        Debrief.find({'_id' : {'$in' : debriefIds}},{'_id':1, '_title._data':1}).exec(function (err, debriefs){
            if(err){
             res.status(404).json({
                message: 'Server Failed (debrief not found)'
              });
            } else {
              debriefs.forEach(function(deb){
                var newItem = {title: "", id:""};
                var title = deb._title._data;
                var id = deb._id;
                newItem.title = title;
                newItem.id = id;
                debriefIdsAndTitles.push(newItem);
              });
              data.debriefs = debriefIdsAndTitles;
              res.json(data);
            }
        });
        
      }, function error(err){
        console.log(err);
        res.json(err);
      });

  });

  router.post('/recommend/what', function(req, res, next) {
    var recommendReq = {
      "messageId" : "1", //TODO: should be deprecated
      "req_type" : "WHAT",
      "text" : req.body.text,
      "userId" : req.user._id,
      "tags" : req.body.tags
    };

    recommendationEngine.getRecommendations(recommendReq)
    .then(
      function success(data){
        var debriefIds = data.debriefs;
        var debriefIdsAndTitles = [];
        debriefIds.forEach(function(id, idx){debriefIds[idx] = mongoose.Types.ObjectId(id);});

        Debrief.find({'_id' : {'$in' : debriefIds}},{'_id':1, '_what._data':1}).exec(function (err, debriefs){
            if(err){
             res.status(404).json({
                message: 'Server Failed (debrief not found)'
              });
            } else {
              debriefs.forEach(function(deb){
                var newItem = {what: "", id:""};
                var what = deb._what._data;
                var id = deb._id;
                newItem.what = what;
                newItem.id = id;
                debriefIdsAndTitles.push(newItem);
              });
              data.debriefs = debriefIdsAndTitles;
              res.json(data);
            }
        });
        
      }, function error(err){
        console.log(err);
        res.json(err);
      });

  });

  router.post('/add_debrief', function(req, res, next) {
    console.log('GOT REQUEST');
    var title = req.body.title;
    var what = req.body.what;
    var userId = req.user._id;
    var deb = new Debrief({ 
      "_cluster" : 0,
      "_title" : 
        {
         "_data" : title,
         "_user" : userId,
         "_score" : 0,
         "_tags" : []  
        },
      "_what" : 
        {
         "_data" : what,
         "_user" : userId,
         "_score" : 0,
         "_tags" : []  
        },
      "_whys" : [],
      "_facts" : [],
      "_learnings" : []
   });

    deb.save(function (err, newDebrief) {
      if (err) {
        console.log("error saving debrief" + err);
        res.json(err);
      }
      else {
        console.log('new Debrief saved:');
        console.log(newDebrief);
        res.json(newDebrief);
      }
    });

  });

  return router;

};

