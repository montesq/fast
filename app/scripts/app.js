'use strict';

var app = angular.module('myApp', ['ngRoute', 'auth', 'menu', 'clients', 'fabrications', 'restangular']).
  config(['$routeProvider',
          '$locationProvider',
          'RestangularProvider',
          function($routeProvider, $locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);

    RestangularProvider.setBaseUrl('https://localhost:9443/api');
    RestangularProvider.setRestangularFields({id: '_id'});
    RestangularProvider.setDefaultHttpFields({withCredentials: true});
  }]);

app.run(function($rootScope) {
  $rootScope.sterapiServer = 'https://localhost:9443';
});

