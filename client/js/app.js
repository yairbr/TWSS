var twssApp = angular.module('twssApp', [
	'ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when('/dashboard', {templateUrl: 'partials/home.html', controller: 'homeController'});
	$routeProvider.when('/debrief/title', {templateUrl: 'partials/title.html', controller: 'debriefController'});
	$routeProvider.when('/debrief/what', {templateUrl: 'partials/what.html', controller: 'debriefController'});

	$routeProvider.otherwise({redirectTo: '/dashboard'});

	$locationProvider.html5Mode({enabled: true, requireBase:false});

}]);