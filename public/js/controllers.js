'use strict'

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    })

  }).
  controller('RegistrationCtrl', function ($scope,$http) {
    // get the registrations
    $http({
        method: 'GET',
        url: 'localhost:3000/getAll/Registrations'
    }).
    success(function(data,status,headers,config) {
        $scope.registrations = data
    })
    .error(function(data,status,headers,config) {
        $scope.registrations = [{Error: "Error in http call"}]
    })

  }).
  controller('SensorCtrl', function ($scope) {
    // write Ctrl here

  })
