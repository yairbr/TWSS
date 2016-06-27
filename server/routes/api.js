function authenticated(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/auth/login");
}

module.exports = function(){

    var express = require('express');
    var router = express.Router();
    var recommendationEngine = require('../config/recommendationEngine');
    var Debrief = require('../models/debrief');
    var User = require('../models/user');
    var Group = require('../models/group');
    var mongoose = require('mongoose');
    var async = require('async');



    router.post('/recommend/title', authenticated, function(req, res, next) {
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

    router.post('/recommend/what', authenticated, function(req, res) {
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

                    Debrief.find({'_id' : {'$in' : debriefIds}},{'_id':1, '_title._data':1}).exec(function (err, debriefs){
                        if(err){
                            res.status(404).json({
                                message: 'Server Failed (debrief not found)'
                            });
                        } else {
                            debriefs.forEach(function(deb){
                                var newItem = {what: "", id:""};
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

    router.post('/add_debrief', authenticated, function(req, res) {
        // console.log('GOT REQUEST');
        var title = req.body.title;
        var what = req.body.what;
        var userId = req.user._id;
        var groups = req.body.groups;

        var users = req.body.users;

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
            "_learnings" : [],
            "_groups" : groups
        });

        deb.save(function (err, newDebrief) {
            if (err) {
                console.log("error saving debrief" + err);
                res.json(err);
            }
            else {
                var response = {
                    deb_id: newDebrief._id,
                    users: users
                };
                res.json(response);
            }
        });

    });

    router.get('/debrief/groups/init', authenticated, function(req, res){
        console.log('got groups request!');
        var res_groups = [];
        Group.find({}, '_id',function(err, groups){
            groups.forEach(function(group){
                res_groups.push(group._id);
            });
            var data = {
                groups: res_groups
            };

            if (err)
                console.log('ERROR');
            console.log('returning result: ' + JSON.stringify(data));
            res.json(data);
        });
    });

    router.post('/debrief/groups/users', authenticated, function(req, res){
        console.log('************************');
        Group.find({'_id' : {'$in' : req.body.groups} },function(err, usersLists){
            if (err){
                console.log('GET USERS ERROR');
                res.json(err);
            }
            var users = [];

            if(usersLists) {
                usersLists.forEach(function (userList) {
                    if (userList) {
                        console.log("first" + userList.toString());
                        userList.users.forEach(function (user) {
                            console.log(JSON.stringify(user));
                            if (users.indexOf(user) === -1) {
                                users.push(user);
                            }
                        });
                    }
                });
            }
            console.log('sending back: '+ users.toString());
            var data = {
                users: users
            };
            res.json(data);
        });

    });

    router.get('/dashboard/finishedDebriefs', authenticated, function(req, res){
        var user = req.session.passport.user;
        console.log('***********');
        console.log(user);
        User.findOne({'_id' : user}, {'_publishedDebriefs': 1}, function(err, data){
            if (err){
                console.log('ERRORR in retrieving finished debriefs for the user ' + user);
                res.json(err);
            }
            var objData = JSON.parse(JSON.stringify(data._publishedDebriefs));

            var datum = [];
            Object.keys(objData).forEach(function(id){
                var obj ={};
                obj.id = id;
                obj.user = data._publishedDebriefs[id]._user;
                obj.title = data._publishedDebriefs[id]._data;
                datum.push(obj);
            });



            console.log('found: ' + datum.toString());
            res.json(datum);
        });

    });

    return router;

};

