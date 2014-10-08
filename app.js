'use strict';

var appServices = angular.module('app.services', []);
var appControllers = angular.module('app.controllers', []);

angular.module('appMobile',[
  'app.services',
  'app.controllers',
  'ionic',
  'LocalStorageModule'
])

.config(['localStorageServiceProvider','$locationProvider','$stateProvider', '$urlRouterProvider','constantes',function (localStorageServiceProvider,$locationProvider,$stateProvider, $urlRouterProvider,constantes){

  $locationProvider.html5Mode(false).hashPrefix('!');

  localStorageServiceProvider.setPrefix(constantes.NAME);

  $urlRouterProvider.otherwise("/home");

  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'views/home.html',
    controller: 'homeCtrl'
  })
  ;
}]);
