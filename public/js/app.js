'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.router'
])

// .config(function ($routeProvider, $locationProvider) {
//   $routeProvider.
//     when('/view1', {
//       templateUrl: 'partials/partial1',
//       controller: 'MyCtrl1'
//     }).
//     when('/view2', {
//       templateUrl: 'partials/partial2',
//       controller: 'MyCtrl2'
//     }).
//     otherwise({
//       redirectTo: '/view1'
//     });

//   $locationProvider.html5Mode(true);
// });

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'MyCtrl'
    });

  $urlRouterProvider.otherwise('/');

});