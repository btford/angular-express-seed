'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', ['ngRoute','myApp.controllers','myApp.filters','myApp.services','myApp.directives', 'ui.bootstrap'])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/landing',
      controller: 'LandingCtrl'
    }).
    when('/view1', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
