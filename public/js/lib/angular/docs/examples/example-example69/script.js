angular.module('locationExample', [])
  .controller('LocationController', ['$scope', '$location', function ($scope, $location) {
    $scope.$watch('locationPath', function(path) {
      $location.path(path);
    });
    $scope.$watch(function() {
      return $location.path();
    }, function(path) {
      $scope.locationPath = path;
    });
  }]);