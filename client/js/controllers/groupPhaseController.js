twssApp.controller('groupPhaseController', ['$scope', '$http','$location', 'Socket', '$cookies', function($scope, $http, $location, Socket, $cookies){
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

    $scope.voteFactElement = function(idx){
        var data = {
            type : "fact",
            debId: debId,
            idx : idx
        };
        Socket.emit('vote', data);
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


    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });



}]);