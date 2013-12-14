'use strict';

var app = angular.module('myApp', ['ngRoute', 'auth', 'menu', 'clients', 'fabrications', 'restangular']).
  config(['$routeProvider',
          '$locationProvider',
          'RestangularProvider',
          function($routeProvider, $locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);

    RestangularProvider.setBaseUrl('http://localhost:9000/api');
    RestangularProvider.setRestangularFields({id: '_id'});

    var token = localStorage.getItem('X-Auth-Token')
    if (token) {
      RestangularProvider.setDefaultHeaders({'X-Auth-Token': token});
    }

    RestangularProvider.setErrorInterceptor(function(response) {
        if (response.status == 401) {
            localStorage.removeItem('email');
        }
        return response;
    });
  }]);

app.run(function($rootScope) {
  $rootScope.sterapiServer = 'http://localhost:9000/api';
});

