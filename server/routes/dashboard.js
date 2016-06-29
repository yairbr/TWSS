module.exports = function(passport, isLoggedIn){
    
    var express = require('express');
    var router = express.Router();

    /* LOGOUT */
    router.get('/logout', function(req, res){
      req.logout();
      res.redirect('/auth/login');
    });

    /* MAIN DASHBOARD */
    router.get('/', isLoggedIn, function(req, res) {
        if (req.session.passport) {
            // console.log('rendering...');
            res.render('index', {user: req.session.passport});
        }
    });

    return router;

};

