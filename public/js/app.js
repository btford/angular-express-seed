'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]);

/*** Controllers ***/

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		$http({
			method: 'GET',
			url: '/api/name'
		}).
			success(function (data, status, headers, config) {
				$scope.name = data.name;
			}).
			error(function (data, status, headers, config) {
				$scope.name = 'Error!';
			});

	}).
	controller('MyCtrl1', function ($scope) {
		// write Ctrl here

	}).
	controller('MyCtrl2', function ($scope) {
		// write Ctrl here

	});

/*** Directives ***/

angular.module('myApp.directives', []).
	directive('appVersion', function (version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};
	});

/*** Filters ***/

angular.module('myApp.filters', []).
	filter('interpolate', function (version) {
		return function (text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	});

/*** Services ***/

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
	value('version', '0.1');
