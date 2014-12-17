'use strict';

/* Filters */

(function() {
    angular.module('myApp.filters', []).
        filter('interpolate', function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version)
            }
        })
})()
