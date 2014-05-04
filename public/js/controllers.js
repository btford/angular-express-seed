'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('MyCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    })

    .success(function (data, status, headers, config) {
      $scope.name = data.name;
    })

    .error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  })

  .controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  });