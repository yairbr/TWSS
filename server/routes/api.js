module.exports = function(autoIncrement, io){

  var Discussion = require('../models/discussion');
  var Argument = require('../models/argument')(autoIncrement);
  var express = require('express');
  var router = express.Router();

  var discussionNsp = io.of('/discussions');
  var argumentsNsp = io.of('/arguments');
  

  /***
   *          _ _                        _                 
   *         | (_)                      (_)                
   *       __| |_ ___  ___ _   _ ___ ___ _  ___  _ __  ___ 
   *      / _` | / __|/ __| | | / __/ __| |/ _ \| '_ \/ __|
   *     | (_| | \__ | (__| |_| \__ \__ | | (_) | | | \__ \
   *      \__,_|_|___/\___|\__,_|___|___|_|\___/|_| |_|___/
   *                                                       
   *                                                       
   */

  //get all the discussions by the role
  //TODO: show the discussions that the requesting user is registred to only.
  //    this may be unnecassary for the future, and just get the arguments of the relevant discussion for
  //    non-admin user.
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

  //post a new discussion
  router.post('/discussions', function(req, res){
    var discussion = new Discussion();
    discussion.title = req.body.title;
    discussion.description = req.body.description;
    discussion.forStudents = req.body.forStudents;
    discussion.forInstructors = req.body.forInstructors;

    discussion.save(function(err, data){
      if (err)
        throw err;
      discussionNsp.emit('new-discussion', data);
    });

  });

  //get a specific discussion
  router.get('/discussions/:id', function(req, res){
    Discussion.findOne({_id: req.params.id}, function(err, data){
      res.json(data);
    });
  });

  //delete a specific discussion
  router.delete('/discussions/:id', function(req, res, next){
    /*
     * I think that discussions should not be totaly 'removed' from database, 
     * but rather be assigned as not-active by appropriate field in the document
          Discussion.remove({_id: req.params.id}, function(err, data){
            res.json({result: err ? 'error' : 'ok'});
          });
      */
    var id = req.params.id;
    Discussion.findByIdAndUpdate(id, {$set: {isActive: false}}, function(err, disc){
      discussionNsp.emit('delete-discussion', disc);
    });
  });

  //update an existing discussion
  router.put('/discussions/:id', function(req, res, next){
    var id = req.params.id;
    var body = req.body;
    Discussion.findByIdAndUpdate(id, body, {new: true}, function(err, disc){
      if (err) return next(err);
      if (!disc){
        return res.status(404).json({
          message: 'Discussion with id ' + id + ' can not be found.'
        });
      }
      discussionNsp.emit('edit-discussion', disc);
    });
  });


  /***
   *                                                 _       
   *                                                | |      
   *       __ _ _ __ __ _ _   _ _ __ ___   ___ _ __ | |_ ___ 
   *      / _` | '__/ _` | | | | '_ ` _ \ / _ | '_ \| __/ __|
   *     | (_| | | | (_| | |_| | | | | | |  __| | | | |_\__ \
   *      \__,_|_|  \__, |\__,_|_| |_| |_|\___|_| |_|\__|___/
   *                 __/ |                                   
   *                |___/                                    
   */

  // var allClients = [];
  argumentsNsp.on('connection', function(socket){
    // var discussionId = socket.handshake.query.discussion;
    // var discussion;
    // Discussion.findOne({_id: discussionId}, function(err, data){
      // discussion = data.title;
    // socket.join(discussionId);
    console.log('a user joined discussion');
    // });
    
    
    
    socket.on('disconnect', function(){
      // socket.leave(discussionId);
      console.log('user disconnected from discussion');
    });
  });

  router.get('/discussions/:id/:discussionName', function(req, res, next){
    var id = req.params.id;
    Argument.find({disc_id: id}, function(err, discArguments){
      if (err){
        return next(err);
      }
      if(!discArguments){
        return res.status(404).json({
          message: 'Discussion with id ' + id + ' can not be found.'
        });
      }
      discArguments[discArguments.length] = {username: req.user.local.username,
                                             fistname: req.user.local.firstname,
                                             lastname: req.user.local.lastname};
      // console.log(discArguments);
      res.json(discArguments);
    });
  });

  router.post('/discussions/:id/:discussionName', function(req, res, next){
    var id = req.params.id;
    var argument = new Argument();

    // console.log(req.body);
    argument.disc_id = id;
    argument.parent_id = (req.body.parent_id ? req.body.parent_id : 0);
    argument.main_thread_id = (req.body.main_thread_id ? req.body.main_thread_id : 0);
    argument.user_id = req.user._id;
    argument.username = req.user.local.username;
    argument.content = req.body.content;
    argument.depth = (req.body.depth ? req.body.depth : 0);
    argument.sub_arguments = [];

    //TODO: add the incoming reply to the array of sub_arguments of the parent
    argument.save(function(err, data){
      if (err)
        throw err;
      // res.json(data);
      // console.log('ddd');
      if (argument.depth === 0){
        argumentsNsp.emit('submitted-new-argument', data);
      }
      else{
        argumentsNsp.emit('submitted-new-reply', data);
      }
    });
  });

  return router;

};

