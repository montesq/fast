'use strict';

var app = angular.module('myApp', ['ngRoute', 'auth', 'clients', 'fabrications', 'restangular',
        'ui.bootstrap.dropdownToggle']).
  config(['$routeProvider', '$locationProvider', 'RestangularProvider', '$compileProvider',
          function($routeProvider, $locationProvider, RestangularProvider, $compileProvider) {
    $routeProvider.
        when('/home', {templateUrl: 'views/home.html'}).
        otherwise({redirectTo: '/home'});
    $locationProvider.html5Mode(true);

    RestangularProvider.setBaseUrl('http://localhost:9000/api');
    RestangularProvider.setRestangularFields({id: '_id'});

    var token = localStorage.getItem('X-Auth-Token');
    if (token) {
      RestangularProvider.setDefaultHeaders({'X-Auth-Token': token});
    }

    RestangularProvider.setErrorInterceptor(function(response) {
        if (response.status == 401) {
            localStorage.removeItem('email');
        }
        return response;
    });

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|blob):/);
  }]);

