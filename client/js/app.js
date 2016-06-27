var twssApp = angular.module('twssApp', [
	'ngRoute', 'ngCookies', 'btford.socket-io','angular-notification-icons', 'ngAnimate'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.when('/dashboard', {templateUrl: 'partials/home.html', controller: 'homeController'});
	$routeProvider.when('/debrief/title', {templateUrl: 'partials/db-title.html', controller: 'debriefController'});
	$routeProvider.when('/debrief/what', {templateUrl: 'partials/db-what.html', controller: 'debriefController'});
	$routeProvider.when('/debrief/group_phase/:debId', {templateUrl: 'partials/group_phase.html', controller: 'groupPhaseController'});


	$routeProvider.otherwise({redirectTo: '/dashboard'});

	$locationProvider.html5Mode({enabled: true, requireBase:false});

}]);