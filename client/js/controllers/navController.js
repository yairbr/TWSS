twssApp.controller('navController', ['$scope', '$location','$window', '$http', function($scope, $location, $window, $http){
	$scope.isActive = function(destination){
		// console.log(destination);
		// console.log($location.path());

		return $location.path().indexOf(destination) > -1;
	};

    $scope.finishedDebriefs = [];
    
    $scope.notifications = [];

    $http({
        method:'GET',
        url: '/api/dashboard/finishedDebriefs'
    })
        .success(function(data){
            console.log('got the finished debriefs!!!! ------->' + JSON.stringify(data));
            $scope.finishedDebriefs = data;
        })
        .error(function(err, status){
            console.log(err.status);
        });

    $http({
        method:'GET',
        url: '/api/dashboard/notifications'
    })
        .success(function(data){
            console.log('got the notifications!!!! ------->' + JSON.stringify(data));
            $scope.notifications = data;
        })
        .error(function(err, status){
            console.log(err.status);
        });

    $scope.redirectToFinishedDebrief = function(debId){
        var landingUrl = "http://" + $window.location.host + "/debrief/view/" + debId;
        $window.open(landingUrl, '_blank');
    }

    $scope.redirectToNotifiedDebrief = function(debId){
        var landingUrl = "http://" + $window.location.host + "/debrief/group_phase/" + debId;
        $window.open(landingUrl, '_self');
    }
	
}]);