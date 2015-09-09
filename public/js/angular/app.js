var app = angular.module('BbApp', ['ngRoute'])

.controller('AppController', ['$scope', '$http', function($scope, $http) {

	

}])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/index.html',
			controller: 'ActivitiesController',
		})
})
console.log("hello");