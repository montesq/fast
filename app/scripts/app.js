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
    RestangularProvider.setDefaultHeaders({'X-Auth-Token': localStorage.getItem('X-Auth-Token')});
    RestangularProvider.setErrorInterceptor(function(response) {
        if (response.status == 401) {
            localStorage.removeItem('email');
        }
        return response;
    });
  }]);

app.run(function($rootScope) {
  $rootScope.sterapiServer = 'https://localhost:9443';
});

