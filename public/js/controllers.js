'use strict';

/* Controllers */

(function() {
    angular.module('myApp.controllers', []).
        controller('AppCtrl', ['$scope','$http', function ($scope, $http) {

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

        }]).
        controller('RegistrationCtrl',['$scope','$http',function ($scope,$http) {
            // get the registrations
            $scope.registrations = []
            $http({
                method: 'GET',
                url: 'http://localhost:3000/getAll/Registration'
            }).
                success(function(data,status,headers,config) {
                    $scope.registrations = data
                })
                .error(function(data,status,headers,config) {
                    $scope.registrations = [{Error: "Error in http call"}]
                })

        }]).
        controller('SensorCtrl', function ($scope) {
            // write Ctrl here

        })
})()

