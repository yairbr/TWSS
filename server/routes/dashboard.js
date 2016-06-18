module.exports = function(passport, isLoggedIn){
    
    var express = require('express');
    var router = express.Router();

    /* LOGOUT */
    router.get('/logout', function(req, res){
      req.logout();
      res.redirect('/auth/login');
    });

    /* ADMIN DASHBOARD */
    router.get('/', isLoggedIn, function(req, res, next) {
      res.render('index', { });
    });

    return router;

};

