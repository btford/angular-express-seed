'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
(function() {
    angular.module('myApp.services', []).
        value('version', '0.1')
    angular.module.factory('userInfoSvc', ['', function(){
        var userInfoSvc = {
            getUserName : function(){
                console.log('returning username infoz')

            }

        }
        return userInfoSvc
    }])
})()
