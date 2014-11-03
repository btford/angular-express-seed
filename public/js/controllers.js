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
                    //console.log("d = " + $scope.name)
                }).
                error(function (data, status, headers, config) {
                    $scope.name = 'Error!';
                })

            $http({
                method: 'GET',
                url: '/api/watable_data'
            }).
                success(function (data, status, headers, config) {
                    $scope.watable_data = data.watable_data
                    console.log("data.watable_data = " + JSON.stringify(data.watable_data))
                }).
                error(function (data, status, headers, config) {
                    $scope.watable_data = 'Error!';
                })

        }]).
        controller('RegistrationCtrl',['$scope','$http',function ($scope,$http) {
            // get the registrations
            $scope.registrations = [{data:"Here I IS"}]
/*
            $http({
                method: 'GET',
               // url: 'http://localhost:3000/getAll/Registration'
                url: 'http://localhost:3000/getAll/Registration'
            }).
                success(function(data,status,headers,config) {
                    console.log("data == " + data)
                    $scope.registrations = data
                })
                .error(function(data,status,headers,config) {
                    $scope.registrations = [{Error: "Error in http call"}]
                })
*/

        }]).
        controller('SensorCtrl', function ($scope) {
            // write Ctrl here

        })
})()

