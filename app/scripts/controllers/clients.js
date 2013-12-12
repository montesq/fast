'use strict';

var app = angular.module('clients', ['ngGrid']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/clients', {templateUrl: '/views/clients/list.html', controller: 'ClientsListCtrl'}).
        when('/clients/add', {
            templateUrl: '/views/clients/detail.html',
            controller: 'ClientDetailCtrl',
            resolve: {
                account: function() {
                    return new Object();
                }
            }
        }).
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
    Restangular.all('accounts').getList().then(function(data){
       $scope.myData = data;
    });

    $scope.columnsDef = [
        {
            field: 'name',
            displayName: 'Nom du client',
            cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>' +
                '<a href="/clients/{{row.getProperty(\'_id\')}}">{{row.getProperty(col.field)}}</a>' +
                '</span></div>'
        },
        {
            field: 'contacts',
            displayName: 'Contacts',
            cellTemplate: '<ul><li ng-repeat="contact in row.getProperty(col.field)">{{contact.email}}</li></ul>'
        },
        {
            field: 'modifiedOn',
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

app.controller('ClientDetailCtrl', function($scope, $location, account, Restangular) {
    if (account._id) {
        var original = account;
        $scope.account = Restangular.copy(original);
    } else {
        $scope.account = account
        $scope.account.contacts = [];
    }

    $scope.save = function() {
        angular.forEach($scope.account.contacts, function(contact) {
            Restangular.one('users', contact.email + '/fabClient').put()
        });

        if (account._id) {
            $scope.account.put().then(function() {
                $location.path('/clients');
            });
        } else {
            Restangular.all('accounts').post($scope.account).then(function() {
                $location.path('/clients');
            });
        }
    };
});