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
               // url: 'http://localhost:3000/getAll/Registration'
                url: 'http://localhost:3000/getByNodeId/Registration/4a3cd823-35d6-4335-9ae5-ddd3df8a1c2e'
            }).
                success(function(data,status,headers,config) {
                    console.log("data == " + data)
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

