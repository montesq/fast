'use strict';

var app = angular.module('clients', ['ngGrid']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/clients', {templateUrl: '/views/clients/list.html', controller: 'ClientsListCtrl'}).
        when('/clients/add', {templateUrl: '/views/clients/detail.html', controller: 'ClientAddCtrl'}).
        when('/clients/:id', {
            templateUrl: '/views/clients/detail.html',
            controller: 'ClientDetailCtrl',
            resolve: {
                account: function(Restangular, $route){
                    return Restangular.one('accounts', $route.current.params.id).get();
                }
            }
        });
    }]);

app.controller('ClientsListCtrl', function($scope, Restangular) {
    $scope.myData = Restangular.all('accounts').getList();

    $scope.columnsDef = [
        {
            field: 'name',
            displayName: 'Nom du client',
            cellTemplate: '<a href="/clients/{{row.getProperty(\'_id\')}}">{{row.getProperty(col.field)}}</a>'
        },
        {
            field: 'contacts',
            displayName: 'Contacts',
            cellTemplate: '<ul><li ng-repeat="contact in row.getProperty(col.field)">{{contact.email}}</li></ul>'
        },
        {
            field: 'modified_on',
            displayName: 'Dernière modif',
            cellFilter: 'date:"shortDate"'
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

app.controller('ClientAddCtrl', function($scope, $location, Restangular) {
    $scope.account = {};
    $scope.account.contacts = [];
    $scope.save = function() {
        Restangular.all('accounts').post($scope.account).then(function() {
            $location.path('/clients');
        });
    };
});

app.controller('ClientDetailCtrl', function($scope, $location, account, Restangular) {
    var original = account;
    $scope.account = Restangular.copy(original);

    $scope.save = function() {
        $scope.account.put().then(function() {
            $location.path('/clients');
        });
    };
});