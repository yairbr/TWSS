twssApp.controller('groupPhaseController', ['$scope', '$http','$location', 'Socket', function($scope, $http, $location, Socket){
    var path = $location.path();
    var debId = path.split('/')[3];
    //console.log(debId);
    $scope.facts = [];

    $scope.whys = [];

    $scope.learnings = [];

    $scope.sendFactElement = function(){
        var type = "fact";
        var factToSend = $scope.fact;
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
        Socket.emit("join-to-room",debId);
    });
    
    Socket.on("elements-refresh", function(elements){
        $scope.facts = elements.fact;
    });

    Socket.on("fact-elements-added", function(facts){
        console.log("receiving facts - " + facts);
        $scope.facts = facts;
    });

    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });

    

}]);