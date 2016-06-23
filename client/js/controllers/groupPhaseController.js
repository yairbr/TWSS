twssApp.controller('groupPhaseController', ['$scope', '$http','$location', 'Socket', function($scope, $http, $location, Socket){
    var path = $location.path();
    var debId = path.split('/')[3];
    //console.log(debId);
    $scope.facts = [];

    $scope.whys = [];

    $scope.learnings = [];



    Socket.connect();


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

    Socket.on("connect", function(){
        console.log("emitting create room");
        Socket.emit("join-to-room",debId);
    });
    
    Socket.on("elements-refresh", function(elements){
        $scope.facts = elements.facts;
    });

    Socket.on("fact-element-added", function(facts){
        console.log("receiving facts - " + facts);
        $scope.facts = facts;
    });

    Socket.on('facts-update-view', function(data){
        $scope.facts = data;
    });

    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });

    

}]);