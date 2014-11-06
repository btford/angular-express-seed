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
                    $scope.tableData = {cols:{},rows:[]}
                    $scope.watable_data = data
                    console.log("data = " + JSON.stringify(data))
                }).
                error(function (data, status, headers, config) {
                    $scope.watable_data = 'Error!';
                })

        }]).
        controller('RegistrationCtrl',['$scope','$http',function ($scope,$http) {
            // get the registrations
            $scope.registrations = []

            $scope.loadRegs = function() {
                console.log("**************INSIDE loadRegs().................")
                $http({
                    method: 'GET',
                    url: 'http://localhost:3000/getAll/Registration'
                }).success(function(data,status,headers,config) {
                        console.log(data)
                        $scope.tableData = {cols:{},rows:[]}
                        $scope.tableData.cols = {
                            nodeId: {index:1,type:"string"},
                            status: {index:2,type:"string"},
                            latitude:{index:3,type:"number"},
                            longitude: {index:4,type:"number"}
                        }

                        var d = data
                        for(var i=0; i<50; i++) {
                            var row = {}
                            row['nodeId'] = d[i].data.message.node.nodeId
                            row['status'] = d[i].data.message.node.status
                            row['latitude'] = d[i].data.message.node.location.latitude
                            row['longitude'] = d[i].data.message.node.location.longitude
                            $scope.tableData.rows.push(row)
                        }
                        var tbl = jQuery('#thetable').WATable({
                    			preFill: false,
                    			debug: true,
                    			filter: true
                    		}).data('WATable')
                        tbl.setData($scope.tableData)

                        $scope.registrations = data
                    }).error(function(data,status,headers,config) {
                        $scope.registrations = [{Error: "Error in http call"}]
                    })
            }

        }]).
        controller('SensorCtrl', function ($scope) {
            // write Ctrl here

        })
})()

