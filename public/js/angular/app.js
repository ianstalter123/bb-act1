var app = angular.module('BbApp', ['ngRoute'])

.controller('AppController', ['$scope', '$http', function($scope, $http) {

	$http.get('/data')
		.success(function(data) {
			$scope.test = data;
			console.log(data)
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

}])

.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/index.html',
			controller: 'ActivitiesController',
		})
})
console.log("hello");