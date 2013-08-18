'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'tpl/login',
      controller: 'loginCtrl'
    }).
    when('/register', {
      templateUrl: 'tpl/register.html',
      controller: 'registerCtrl'
    }).
   when('/home', {
      templateUrl: 'tpl/home',
      controller: 'homeCtrl'
    }).     
    otherwise({
      redirectTo: '/home'
    });

  $locationProvider.html5Mode(true);
});
