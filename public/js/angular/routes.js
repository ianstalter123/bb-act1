angular.module('myRoutes',['ngRoute'])
.config(function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl: 'views/icecreams/index.html',
    controller: 'IceCreamController',
    controllerAs: 'icecream'
  })
})