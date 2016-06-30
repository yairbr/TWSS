twssApp.controller('navController', ['$scope', '$location','$window', '$http','Socket', function($scope, $location, $window, $http,Socket){
	$scope.isActive = function(destination){
		// console.log(destination);
		// console.log($location.path());

		return $location.path().indexOf(destination) > -1;
	};

    $scope.finishedDebriefs = [];
    
    $scope.notifications = [];

    $scope.unreadFinishedDebriefs = $scope.finishedDebriefs.length;

    $http({
        method:'GET',
        url: '/api/dashboard/finishedDebriefs'
    })
        .success(function(data){
            // console.log('got the finished debriefs!!!! ------->' + JSON.stringify(data));
            $scope.finishedDebriefs = data;
            $scope.unreadFinishedDebriefs = $scope.finishedDebriefs.length;
        })
        .error(function(err, status){
            console.log(err.status);
        });

    $http({
        method:'GET',
        url: '/api/dashboard/notifications'
    })
        .success(function(data){
            // console.log('got the notifications!!!! ------->' + JSON.stringify(data));
            $scope.notifications = data;
        })
        .error(function(err, status){
            console.log(err.status);
        });

    $scope.redirectToFinishedDebrief = function(debId){
        if ($scope.unreadFinishedDebriefs) $scope.unreadFinishedDebriefs = $scope.unreadFinishedDebriefs-1;
        var landingUrl = "http://" + $window.location.host + "/debrief/view/" + debId;
        $window.open(landingUrl, '_blank');
    };

    $scope.redirectToNotifiedDebrief = function(debId){
        if ($scope.unreadFinishedDebriefs) $scope.unreadFinishedDebriefs = $scope.unreadFinishedDebriefs-1;
        var landingUrl = "http://" + $window.location.host + "/debrief/group_phase/" + debId;
        $window.open(landingUrl, '_self');
    };
    
    $scope.userLogout = function(){
        var landingUrl = "http://" + $window.location.host + "/auth/logout";
        $window.open(landingUrl, '_self');
    }
    
    
	
}]);