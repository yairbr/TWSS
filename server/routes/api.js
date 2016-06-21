module.exports = function(){

  var express = require('express');
  var router = express.Router();
  var recommendationEngine = require('../config/recommendationEngine')('132.73.195.153', 4000);
  var Debrief = require('../models/debrief');
  var mongoose = require('mongoose');
  var async = require('async');

  router.post('/recommend/title', function(req, res, next) {
    var messageId = "1"; //TODO: should be deprecated
    var req_type = "TITLE";
    var text = req.body.text;
    var userId = req.user._id;
    var tags = req.body.tags;

    var recommendReq = {
      "messageId" : messageId,
      "req_type" : req_type,
      "text" : text,
      "userId" : userId,
      "tags" : tags
    };
    
    // console.log('**');
    // console.log('got the title: ' + text);
    // console.log('**');
    // console.log('sending to recommending engine: ' + JSON.stringify(recommendReq));
    recommendationEngine.getRecommendations(recommendReq)
    .then(
      function success(data){
        // console.log('**');
        // console.log('got response: ' + JSON.stringify(data));
        var debriefIds = data.debriefs;
        var debriefIdsAndTitles = [];
        debriefIds.forEach(function(id, idx){debriefIds[idx] = mongoose.Types.ObjectId(id);});

        Debrief.find({'_id' : {'$in' : debriefIds}},{'_id':1, '_title._data':1}).exec(function (err, debriefs){
            if(err){
             res.status(404).json({
                message: 'Server Failed (debrief not found)'
              });
            } else {
              // console.log('**');
              // console.log('old debriefs in data: ' + data.debriefs.toString());
              // console.log('**');
              // console.log(data); 
              debriefs.forEach(function(deb){
                var newItem = {title: "", id:""};
                var title = deb._title._data;
                var id = deb._id;
                newItem.title = title;
                newItem.id = id;
                debriefIdsAndTitles.push(newItem);
              });
              data.debriefs = debriefIdsAndTitles;
              // console.log('**');
              // console.log('NEW debriefs in data: ' + data.debriefs.toString());
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
    console.log(title);
    console.log(what);
    console.log(userId);

    console.log('adding debrief!');

    // var deb = new Debrief();
    // deb._cluster = 0;
    // deb._title = {
    //   _data : title,
    //   _user : userId,
    //   _score : 0,
    //   _tags : []
    // };
    // deb._what = {
    //   _data : what,
    //   _user : userId,
    //   _score : 0,
    //   _tags : []
    // };

    // console.log(deb);
    var deb = new Debrief({ 
                                "_cluster" : 0,
                                "_title" : {
                                               "_data" : title,
                                               "_user" : userId,
                                               "_score" : 0,
                                               "_tags" : []  },
                                "_what" : {
                                               "_data" : what,
                                               "_user" : userId,
                                               "_score" : 0,
                                               "_tags" : []  },
                                "_whys" : [],
                                "_facts" : [],
                                "_learnings" : []
                                             });
    console.log("*******************************************************************");
    console.log(deb);
    console.log("*******************************************************************");

    deb.save(function (err, newDebrief) {
      if (err) {
        console.log("error saving debrief" + err);
        res.json(err);
      }
      else {
        console.log(newDebrief);
        res.json(newDebrief);
      }
    });

  });

  return router;

};

