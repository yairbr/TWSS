twssApp.controller('groupPhaseController', ['$scope', '$http','$location', 'Socket', '$cookies','$window', function($scope, $http, $location, Socket, $cookies,$window){
    var path = $location.path();
    var debId = path.split('/')[3];
    //console.log(debId);

    /**
     * can be one of: "fact", "why", "learning"
     */
    $scope.stateEnum = "fact";

    $scope.facts = [];

    $scope.whys = [];

    $scope.learnings = [];

    $scope.sendFactElement = function(){
        console.log('sending fact element');
        var type = "fact";
        var factToSend = $scope.fact;
        console.log($scope.fact);
        if (factToSend){
            var factData = {
                type: type,
                data: factToSend,
                debId: debId
            };
            console.log('emiting the fact: ' + factData);
            Socket.emit('add-element', factData);
        }
    };

    $scope.sendLearningElement = function(){
        console.log('sending learning element');
        var type = "learning";
        var learningToSend = $scope.learning;
        console.log($scope.learning);
        if (learningToSend){
            var learningData = {
                type: type,
                data: learningToSend,
                debId: debId
            };
            console.log('emiting the learning: ' + learningData);
            Socket.emit('add-element', learningData);
        }
    };

    $scope.sendWhyElement = function(){
        console.log('sending why element');
        var type = "why";
        var whyToSend = $scope.why;
        console.log($scope.why);
        if (whyToSend){
            var whyData = {
                type: type,
                data: whyToSend,
                debId: debId
            };
            console.log('emiting the why: ' + whyData);
            Socket.emit('add-element', whyData);
        }
    };

    $scope.nextPhase = function(){
        console.log('emiting the next phase on IO server');
        Socket.emit('next-phase', debId);
    };

    $scope.voteFactElement = function(idx){
        var data = {
            type : "fact",
            debId: debId,
            idx : idx
        };
        Socket.emit('vote', data);
    };

    $scope.voteWhyElement = function(idx){
        var data = {
            type : "why",
            debId: debId,
            idx : idx
        };
        Socket.emit('vote', data);
    };

    $scope.voteLearningElement = function(idx){
        var data = {
            type : "learning",
            debId: debId,
            idx : idx
        };
        Socket.emit('vote', data);
    };


    $scope.finishDebrief = function(){
        Socket.emit('finish', debId);
    };
    
    
    
    
    
    

    Socket.connect();

    Socket.on("connect", function(){
        console.log("emitting create room");
        var users = JSON.parse($cookies.get('users'));
        console.log('********************/////////////////////************%%%%%%%%%%%%%5');
        console.log(users);
        var joinRoomData = {
            debId: debId,
            users: users
        };
        Socket.emit("join-to-room",joinRoomData);
    });

    Socket.on("elements-refresh", function(elements){
        $scope.facts = elements.fact;
        $scope.whys = elements.why;
        $scope.learnings = elements.learning;
    });

    Socket.on("fact-elements-added", function(facts){
        console.log("receiving facts - " + facts);
        $scope.facts = facts;
    });

    Socket.on("why-elements-added", function(whys){
        console.log("receiving whys - " + whys);
        $scope.whys = whys;
    });

    Socket.on("learning-elements-added", function(learnings){
        console.log("receiving learnings - " + learnings);
        $scope.learnings = learnings;
    });

    Socket.on('start-why-phase', function(){
        console.log("changing state to why phase");
        $scope.stateEnum = "why";
    });

    Socket.on('start-learning-phase', function(){
        console.log("changing state to learning phase");
        $scope.stateEnum = "learning";
    });

    Socket.on('finished', function(debId){
        console.log('finished!. opening the debrief!');
        var debUrl = "http://" + $window.location.host + "/debrief/view/" + debId;
        $window.open(debUrl, '_blank');
    });

    Socket.on('back-to-dashboard', function(){
        console.log('finished!. back to dashboard guys~!!');
        var landingUrl = "http://" + $window.location.host + "/dashboard";
        $window.open(landingUrl, '_self');
    });
    
    
    
    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });



}]);