twssApp.controller('groupPhaseController', ['$scope', '$http','$location', function($scope, $http, $location){
		var path = $location.path();
    	var discId = path.split('/')[3];
    	console.log(discId);
	}]
);