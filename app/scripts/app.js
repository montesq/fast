'use strict';

var app = angular.module('myApp', ['auth','menu', 'clients']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
  }]);

app.run(function($rootScope) {
  $rootScope.sterapiServer = "http://localhost:9000"
});