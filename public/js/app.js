'use strict';

// Declare app level module which depends on filters, and services
(function() {
    angular.module('myApp', [
        'myApp.controllers',
        'myApp.filters',
        'myApp.services',
        'myApp.directives'
    ]).
        config(function ($routeProvider, $locationProvider) {
            $routeProvider.
                when('/view1', {
                    templateUrl: 'partials/partial1',
                    controller: 'AppCtrl'
                }).
                when('/view2', {
                    templateUrl: 'partials/partial2',
                    controller: 'AppCtrl'
                }).
                otherwise({
                    redirectTo: '/view1'
                })

            $locationProvider.html5Mode(true)
        })
})()
