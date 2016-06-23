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
    // var User = require('../models/user');
    //
    // var addElement = require('../config/add_element')();
    // var itemsSorter = require('../config/sort')();

    app.use('/auth', authRouter);
    app.use('/dashboard', dashboardRouter);

    app.get('/debrief/view/:debId', function(req, res, next){
        var debId = mongoose.Types.ObjectId(req.params.debId);
        // console.log('redirecting to deb: ' + debId);
        var debrief = Debrief.findById(debId, function(err, deb){
            if (err){
                res.status(404).json({
                    message: 'Server Failed (debrief not found)'
                });
            }
            // console.log('**');
            // console.log(deb);
            res.render('debrief_view', {deb : deb});
        });
    });
    
    var restApiRouter = require('./api')();
    app.use('/api', restApiRouter);

    app.get('*', isLoggedIn("/auth/login"), function(req, res, next) {
        res.render('index', { });
    });



    /* Real-Time */
    //TODO: define all the real time events

    var users = [];
    var types = {
        fact:[],
        why:[],
        learning:[]
    };

    io.on('connection', function(socket){
        console.log('CONNECTED!!!!');
        if (socket.request.session.passport) {
            var user = socket.request.session.passport.user;
            socket.on('join-to-room', function(debId) {
                console.log('DEBUG: creating room... ' + debId);
                users.push(user);
                socket.join(debId);
                io.to(debId).emit('elements-refresh', types);
            });

            socket.on('add-element', function(element) {
                console.log('adding element : ' + element);
                if(element) {
                    var type = element.type;
                    var elementToAdd = {
                        user : user,
                        score : 0,
                        data : element.data
                    };
                    var debId = element.debId;
                    types[type].push(elementToAdd);
                    console.log('new ' + type + ' data is: ' + types[type].toString());
                    io.to(debId).emit(type + '-elements-added', types[type]);
                }
            });

            socket.on('vote', function(data) {
                var type = data.type;
                var debId = data.debId;
                var idx = data.idx;
                var element = types[type][idx];
                element.score++;
                io.to(debId).emit(type + '-elements-added', types[type]);
            });

            socket.on('disconnect', function(){
                console.log('a user disconnected!');
            });


        }
        else{

        }
    });



    


};