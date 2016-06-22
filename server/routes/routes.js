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
    var addElement = require('../config/add_element')();
    var itemsSorter = require('../config/sort')();

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

    /* Real-Time */
    //TODO: define all the real time events



    io.on('connection', function(socket){
        if (socket.request.session.passport) {
            socket.on('create-room', function(debId){
                console.log('DEBUG: creating room... ' + debId);
                socket.join(debId);
            });


            var userId = socket.request.session.passport.user;
            console.log("Your User ID is", userId);
            if(users.indexOf(userId) > -1){
                socket.on('add-element',function (msg) {
                    console.log('DEBUG: adding an element...' + msg);
                    var debId = msg.debId;
                    var type  = msg.type;
                    var text  = msg.text;

                    var element = {
                        'user'  : userId,
                        'type'  : type,
                        'text'  : text,
                        'debId' : debId
                    };
                    addElement.add_element(element);

                    var objToSort = {
                        'type' : type,
                        'debId' : debId
                    };

                    var ansArray = itemsSorter.sort(objToSort);
                    io.to(debId).emit(type + '-element-added', ansArray);
                });

            }
            socket.on('disconnect', function(){
                console.log('a user disconnected!');
            });
        }
        else{

        }
    });








    /*
     *  Server API
     */
    var restApiRouter = require('./api')(io);
    app.use('/api', restApiRouter);

    app.get('*', isLoggedIn("/auth/login"), function(req, res, next) {
        res.render('index', { });
    });
};