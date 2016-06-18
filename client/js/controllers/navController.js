twssApp.controller('navController', ['$scope', '$location', function($scope, $location){
	$scope.isActive = function(destination){
		// console.log(destination);
		// console.log($location.path());
		return destination === $location.path();
	};
}]);