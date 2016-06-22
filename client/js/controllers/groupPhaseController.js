twssApp.controller('groupPhaseController', ['$scope', '$http','$location', 'Socket', function($scope, $http, $location, Socket){
		var path = $location.path();
    	var debId = path.split('/')[3];
    	console.log(debId);

    	Socket.connect();

    	$scope.sendFact = function(){
    		var type="facts";
    		var factToSend = $scope.fact;
    		if (factToSend){
    			console.log('working on it..');
    		}
    	};

    	$scope.$on('$locationChangeStart', function(event){
    		Socket.disconnect(true);
    	});
	}]
);