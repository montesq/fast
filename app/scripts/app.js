'use strict';

var app = angular.module('myApp', ['auth','menu', 'clients', 'restangular']).
  config(['$routeProvider',
          '$locationProvider',
          'RestangularProvider',
          function($routeProvider, $locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);

    RestangularProvider.setBaseUrl('https://localhost:9443/api');
    RestangularProvider.setRestangularFields({id: '_id'});
  }]);

app.run(function($rootScope) {
  $rootScope.sterapiServer = "https://localhost:9443"
});