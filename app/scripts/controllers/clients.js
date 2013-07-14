'use strict';

var app = angular.module('clients', ['ngGrid']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/clients', {templateUrl: 'views/clients/list.html', controller: ClientsListCtrl}).
        otherwise({redirectTo:'/'});
//        when('/clients/add', {templateUrl: 'views/clients/add.html', controller: 'clientsAddCtrl'}).
//        when('/clients/:id', {templateUrl: 'views/clients/detail.html', controller: 'clientDetailCtrl'});
}]);

function ClientsListCtrl($scope) {
    $scope.myData = [
        {name: "Moroni", age: 50},
        {name: "Tiancum", age: 43},
        {name: "Jacob", age: 27},
        {name: "Nephi", age: 29},
        {name: "Enos", age: 34}];
    $scope.gridOptions = { data : 'myData' };
}

