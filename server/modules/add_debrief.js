module.exports = function(){

  var express = require('express');
  var router = express.Router();
  var Debrief = require('../models/debrief');
  var mongoose = require('mongoose');

// change here the rout
  router.post('/like', function(req, res, next) {
    var title = req.title;
    var what = req.what;
    var user = req.user;

    var deb = new Debrief({ 
                                "_cluster" : 0,
                                "_title" : {
                                               "_data" : title,
                                               "_user" : user,
                                               "_score" : 0,
                                               "_tags" : []  },
                                "_what" : {
                                               "_data" : what,
                                               "_user" : user,
                                               "_score" : 0,
                                               "_tags" : []  },
                                             });
    deb.save(function (err) {
      if (err) {
        return err;
      }
      else {
        console.log("Post saved");
      }
    });

  });

  return router;
};
