'use strict';

var app = angular.module('myApp', ['auth','menu', 'clients', 'restangular']).
  config(['$routeProvider',
          '$locationProvider',
          'RestangularProvider',
          function($routeProvider, $locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);

    RestangularProvider.setBaseUrl('http://localhost:9000/api');
    RestangularProvider.setRestangularFields({id: '_id'});
  }]);

app.run(function($rootScope) {
  $rootScope.sterapiServer = "http://localhost:9000"
});