var twssApp = angular.module('twssApp', [
	'ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when('/dashboard', {templateUrl: 'partials/home.html', controller: 'homeController'});
	$routeProvider.when('/debrief', {templateUrl: 'partials/title.html', controller: 'debriefController'});

	$routeProvider.otherwise({redirectTo: '/dashboard'});

	$locationProvider.html5Mode({enabled: true, requireBase:false});

}]);