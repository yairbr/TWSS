twssApp.controller('groupPhaseController', ['$scope', '$http','$location', 'Socket', function($scope, $http, $location, Socket){
    var path = $location.path();
    var debId = path.split('/')[3];
    //console.log(debId);
    $scope.facts = [];

    $scope.whys = [];

    $scope.learnings = [];

    $scope.factPhase = true;

    $scope.whyPhase = false;

    $scope.learningPhase = false;

    Socket.connect();

    $scope.changeDiv = function (element){
        switch (element){
            case "why":
                $scope.factPhase = false;
                $scope.whyPhase = true;
                break;
            case "learning":
                $scope.whyPhase = false;
                $scope.learningPhase = true;
                break;
        }

    };


    $scope.sendFactElement = function(){
        var type = "fact";
        var factToSend = $scope.fact;
        if (factToSend){
            var factData = {
                type: type,
                text: $scope.fact,
                debId: debId
            };
            Socket.emit('add-fact-element', factData);
        }
    };

    $scope.sendWhyElement = function(){
        var type = "why";
        var whyToSend = $scope.why;
        if (whyToSend){
            var whyData = {
                type: type,
                text: $scope.why,
                debId: debId
            };
            Socket.emit('add-why-element', whyData);
        }
    };

    $scope.sendFactElement = function(){
        var type = "learning";
        var learningToSend = $scope.learning;
        if (learningToSend){
            var learningData = {
                type: type,
                text: $scope.learning,
                debId: debId
            };
            Socket.emit('add-learning-element', learningData);
        }
    };

    $scope.addElementVote = function(element){
        console.log("sending element vote - " + element);
        element.debId = debId;
        Socket.emit("add-vote",data);
    };

    Socket.on("fact-element-added", function(facts){
        console.log("receiving facts - " + facts);
        $scope.facts = facts;
    });

    Socket.on("why-element-added", function(whys){
        console.log("receiving whys - " + whys);
        $scope.whys = whys;
    });

    Socket.on("learning-element-added", function(learnings){
        console.log("receiving learnings - " + learnings);
        $scope.learnings = learnings;
    });


    Socket.on("connect", function(){
        console.log("emitting create room");
        Socket.emit("create-room",debId);
    });

    Socket.on('facts-update-view', function(data){
        $scope.facts = data;
    });

    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });


}]);