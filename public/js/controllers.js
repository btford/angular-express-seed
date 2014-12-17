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
        controller('RegistrationCtrl',['$scope','$http', 'userInfoSvc', function ($scope,$http, userInfoSvc) {
            $scope.loadRegs = function() {
                console.log("**************INSIDE loadRegs().................")
                $http({
                    method: 'GET',
                    url: 'http://localhost:3000/getAll/Registration'
                }).success(function(data,status,headers,config) {
                        console.log(data)
                        $scope.tableData = {cols:{},rows:[]}
                        $scope.tableData.cols = {
                            NodeId:             {index:1,type:"string",unique:true},
                            Description:        {index:2,type:"string"},
                            Status:             {index:3,type:"string",tooltip:"the status of the node"},
                            Latitude:           {index:4,type:"number"},
                            Longitude:          {index:5,type:"number"},
                            Altitude:           {index:6,type:"number"},
                            OriginTimestamp:    {index:7,type:"string"},
                            Updated:            {index:8,type:"string"}
                        }

                        var d = data
                        for(var i=0; i<50; i++) {
                            var row = {}
                            row['NodeId']           = d[i].data.message.node.nodeId
                            row['Description']      = d[i].data.message.node.description
                            row['Status']           = d[i].data.message.node.status
                            row['Latitude']         = d[i].data.message.node.location.latitude
                            row['Longitude']        = d[i].data.message.node.location.longitude
                            row['Altitude']         = d[i].data.message.node.location.altitude
                            row['OriginTimestamp']  = d[i].data.message.originTimestamp
                            row['Updated']          = d[i].data.message.updated

                            $scope.tableData.rows.push(row)
                        }
                        jQuery('#thetable').html("").WATable({
                    			preFill:    false,
                    			debug:      true,
                    			filter:     true,
                                rowClicked: function(data) {
                                    $scope.displayDetail(data)
                                }
                    	}).data('WATable').setData($scope.tableData)

                    }).error(function(data,status,headers,config) {
                        $scope.registrations = [{Error: "Error in http call"}]
                    })

                    $scope.userInfo = userInfoSvc.getUserName()
                    // userinfo.username
                    // userinfo.email
                    console.log('userinfo: ', $scope.userInfo)

                    // this would be how we get the user info and perms. this belongs in a service.
                    //TODO: there is a bug here somewhere, this is getting called twice

            }
            $scope.displayDetail = function(data) {
                //TODO flesh out what it takes to get the necessary info to the node-detail page
                alert(JSON.stringify(data.row))
            }

            //execute the loading of the registrations
            $scope.loadRegs()

        }]).
        controller('SensorCtrl', function ($scope) {
            // write Ctrl here

        })
})()

