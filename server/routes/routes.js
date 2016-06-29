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
    var User = require('../models/user');
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
        if (req.session.passport) {
            // console.log('rendering...');
            res.render('index', {user: req.session.passport});
        }
    });



    /* Real-Time */
    //TODO: define all the real time events

    var rooms = {
    };


    var goToNextPhase= function(phase){
        switch (phase){
            case "fact":
                return "why";
                break;
            case "why":
                return "learning";
                break;
            default:
                break;
        }
    };

    var checkIfContainsUser = function(user, debId){
        for(var i = 0; i < rooms[debId].users.length; i++){
            if (rooms[debId].users[i].user === user){
                return true;
            }
        }
        return false;
    };

    var calc_score = function (score_obj) {
        if (!score_obj.rating || score_obj.rating == 0)
            score_obj.rating = 1;
        if (!score_obj.rank || score_obj.rank == 0)
            score_obj.rank = 1;
        var numerator = ((score_obj.score + 1) * score_obj.rank * score_obj.rating);
        var denominator = (score_obj.score + score_obj.rank + score_obj.rating);
        return numerator / denominator;
    };



    io.on('connection', function(socket){
        if (socket.request.session.passport) {
            var user = socket.request.session.passport.user;

            socket.on('join-to-room', function(joinRoomData) {
                var room = {
                    users : [],
                    phase : "fact",
                    types : {
                        fact:[],
                        why:[],
                        learning:[],
                        title: "Debrief"
                    }
                };

                var debId = joinRoomData.debId;
                console.log('user ' + user + ' wants to join the room ' + debId);
                if (joinRoomData.users && !rooms[debId]){
                    var usernames = joinRoomData.users.map(function(u) {return u.user;});
                    User.find({'_id': {'$in': usernames}}, {'_id': 1, '_rating': 1}, function (err, data) {
                        if (err) {
                            res.status(404).json({
                                message: 'Server Failed (debrief not found)'
                            });
                        } else {
                            joinRoomData.users.forEach(function(user){
                                data.forEach(function(user1){
                                    if(user.user === user1._id){
                                        user.rating = user1._rating;
                                        room.users.push(user);
                                    }
                                });
                            });
                            rooms[debId] = room;
                            console.log('/*/***/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*');
                            console.log(JSON.stringify(rooms[debId]));
                            Debrief.findOne({'_id' : debId}, function(err, deb){
                                rooms[debId].types.title = deb._title._data;
                                socket.join(debId);
                                io.to(debId).emit('elements-refresh', rooms[debId].types);
                            });
                            
                        }
                    });
                }
                else if (checkIfContainsUser(user, debId)){
                    console.log('user ' + user + ' is already connected!');
                    socket.join(debId);
                    io.to(debId).emit('elements-refresh', rooms[debId].types);
                    io.to(debId).emit('start-' + rooms[debId].phase + '-phase');
                }
            });

            socket.on('add-element', function(element) {
                console.log(JSON.stringify(element));
                console.log(rooms[element.debId]);
                console.log('****************************');
                if(element) {
                    var type = element.type;
                    var rating = 0;
                    var rank = 1;
                    rooms[element.debId].users.forEach(function (user){
                        if(user.user === user){
                            rating = user.rating;
                            rank = user.rank;
                        }
                    });
                    var elementToAdd = {
                        user : user,
                        score : 0,
                        data : element.data,
                        rating : rating,
                        rank : rank
                    };
                    var debId = element.debId;
                    rooms[debId].types[type].push(elementToAdd);
                    var sortedArray = rooms[debId].types[type].sort(function (a, b) {
                        return (calc_score(a) >calc_score(b)) ? -1 : ((calc_score(b) > calc_score(a)) ? 1 : 0);
                    });

                    // io.to(debId).emit(type + '-elements-added', types[type]);
                    io.to(debId).emit(type + '-elements-added', sortedArray);
                }
            });

            socket.on('vote', function(data) {
                var type = data.type;
                var debId = data.debId;
                var idx = data.idx;
                var element = rooms[debId].types[type][idx];
                element.score++;
                var sortedArray = rooms[debId].types[type].sort(function (a, b) {
                    return (calc_score(a) >calc_score(b)) ? -1 : ((calc_score(b) > calc_score(a)) ? 1 : 0);
                });
                io.to(debId).emit(type + '-elements-added', sortedArray);
            });

            socket.on('next-phase', function(debId){
                rooms[debId].phase = goToNextPhase(rooms[debId].phase);
                io.to(debId).emit('start-' + rooms[debId].phase + '-phase');
            });

            socket.on('disconnect', function(){
                console.log('user ' + user + ' has disconnected!');
            });

            socket.on('finish', function(debId){
                var room = rooms[debId];
                var facts = room.types.fact;
                var whys = room.types.why;
                var learnings = room.types.learning;

                var cleanData = function(element) {
                    element._scoring = element.score;
                    delete element['score'];
                    element._user = element.user;
                    delete element['user'];
                    element._data = element.data;
                    delete element['user'];
                    delete element['rank'];
                    delete element['rating'];
                };

                facts.forEach(cleanData);
                whys.forEach(cleanData);
                learnings.forEach(cleanData);

                var ranks = {};
                room.users.forEach(function (user){
                    ranks[user.user] = user.rank;
                });

                Debrief.findOneAndUpdate({'_id' : debId}, {$set: { '_facts': facts,
                        '_whys': whys,
                        '_learnings' : learnings,
                        '_ranking' : ranks }}, {'upsert': true},
                    function(err, data){
                        if(err){
                            console.log("Some error occured updating debrief : " + debId );
                        }
                        else{
                            console.log("this is updated object " + debId);
                            //TODO: the boweser blocks the popup for the last debrief
                            io.to(debId).emit('finished', debId);
                            io.to(debId).emit('back-to-dashboard');
                            var usernames = rooms[debId].users.map(function(u) {return u.user;});
                            console.log('********************************');
                            console.log(usernames.toString());
                            console.log(JSON.stringify(data._title));
                            console.log('********************************');
                            delete rooms[debId];

                            var published = {};
                            published['_publishedDebriefs.' + debId] = data._title;
                            User.update({'_id' : {'$in' : usernames }}, {$set : published }, {'upsert': true, multi: true}, function(err){
                                if(err){
                                    console.log("Some error occured updating debrief : " + debId );
                                } else{
                                    var notifications = {};
                                    notifications['_notifications.' + debId] = 1;
                                    User.update({'_id' : {'$in' : usernames }}, {$unset : notifications }, {'upsert': true, multi: true}, function(err){
                                        if(err){
                                            console.log("Some error occured updating debrief : " + debId );
                                        }
                                    });
                                }
                            });


                        }
                    });

            });
        }
        else{

        }
    });






};