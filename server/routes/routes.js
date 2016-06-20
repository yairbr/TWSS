var isLoggedIn = function(loginRedirect){
  return function(req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect(loginRedirect);
  };
};

module.exports = function(app, passport){
    
    /*
     *  Server Routing
     */
    var path = require('path');
    var authRouter = require('./auth')(passport);
    var dashboardRouter = require('./dashboard')(passport, isLoggedIn("/auth/login"));
    app.use('/auth', authRouter);
    app.use('/dashboard', dashboardRouter);
    /*
     *  Server API
     */
    restApiRouter = require('./api')();
    app.use('/api', restApiRouter);    

    app.get('*', isLoggedIn("/auth/login"), function(req, res, next) {
      res.render('index', { });
    });
};