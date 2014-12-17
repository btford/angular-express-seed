'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
(function() {
    angular.module('myApp.services', [])
        .value('version', '0.1')
    // return user info and permissions
        .factory('userInfoSvc', ['$http', function($http){
            var userInfoSvc = {
                getUserName : function(){
                    $http.get('/api/userinfo')
                        .success(function(data){
                            return(data)
                        })
                        .error(function(){
                            return(new Error('unable to retrieve user data'))
                        })
                }

        }
        return userInfoSvc
    }])
})()
