var isLoggedIn = function(loginRedirect){
  return function(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect(loginRedirect);
  };
};

module.exports = function(app, passport, io){
    
  /*
   *  Server Routing
   */
  var path = require('path');
  var authRouter = require('./auth')(passport);
  var dashboardRouter = require('./dashboard')(passport, isLoggedIn("/auth/login"));
  var mongoose = require('mongoose');

  var Debrief = require('../models/debrief');

  app.use('/auth', authRouter);
  app.use('/dashboard', dashboardRouter);

  app.get('/debrief/view/:debId', function(req, res, next){
    var debId = mongoose.Types.ObjectId(req.params.debId);
    console.log('redirecting to deb: ' + debId);
    debrief = Debrief.findById(debId, function(err, deb){
      if (err){
        res.status(404).json({
              message: 'Server Failed (debrief not found)'
            });
      }
      console.log('**');
      console.log(deb);
      res.render('debrief_view', {deb : deb});
    });
    
  });

  /*
   *  Server API
   */
  restApiRouter = require('./api')(io);
  app.use('/api', restApiRouter);    

  app.get('*', isLoggedIn("/auth/login"), function(req, res, next) {
    res.render('index', { });
  });
};