module.exports = function(){

  var express = require('express');
  var router = express.Router();
  var Debrief = require('../models/debrief');
  var mongoose = require('mongoose');

    return {
        vote : function(msg, callback){
            var type = "_" + msg.type;
            var text = msg.text;
            var id = msg.id;
            var typedata = type + '._data';
            var typescore = type + '.$._score';
            Debrief.update({ '_id' : id , typedata : text }, { '$inc' : { typescore : 1 }}, callback);
        }
    };
};
