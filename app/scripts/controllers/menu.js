'use strict';

angular.module('menu', ['ui.bootstrap.dropdownToggle']);

function MenuCtrl($scope, $http) {
  $http.get('/mock/menu.json').success(function(data) {
    $scope.menu = data;
  });  
}
