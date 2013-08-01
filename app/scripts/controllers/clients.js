'use strict';

var app = angular.module('clients', ['ngGrid']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/clients', {templateUrl: 'views/clients/list.html', controller: 'ClientsListCtrl'}).
        otherwise({redirectTo:'/'});
//        when('/clients/add', {templateUrl: 'views/clients/add.html', controller: 'clientsAddCtrl'}).
//        when('/clients/:id', {templateUrl: 'views/clients/detail.html', controller: 'clientDetailCtrl'});
}]);

app.controller('ClientsListCtrl', function($scope, Restangular) {
    $scope.myData = Restangular.all("accounts").getList();

    $scope.columnsDef = [
        {
            field: 'name',
            displayName: 'Nom du client',
            cellTemplate: '<a href="/clients/{{row.getProperty(\'_id\')}}">{{row.getProperty(col.field)}}</a>'
        },
        {
            field: 'contacts',
            displayName: 'Contacts',
            cellTemplate: '<ul><li ng-repeat="contact in row.getProperty(col.field)">{{contact}}</li></ul>'
        },
        {
            field: 'modified_on',
            displayName: 'Dernière modif',
            cellTemplate: '<span>{{row.getProperty(col.field)| date:"shortDate"}}</span>'
        }
    ];

    $scope.gridOptions = {
        data : 'myData',
        columnDefs: 'columnsDef',
        rowHeight: 60,
        enableRowSelection: false,
        showFooter: true,
        showFilter: true
    };
});