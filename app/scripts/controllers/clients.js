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

    $scope.saveContacts = function() {
        angular.forEach($scope.account.contacts, function(contact) {
            Restangular.one('users', contact.email.toLowerCase()).
                one('accounts', account._id).
                one('profiles', 'FABRICATION_CLIENT').
                put()
        });
    }

    $scope.removeContact = function() {
        if ($scope.account._id) {
            Restangular.one('users', this.contact.email.toLowerCase()).
                one('accounts', $scope.account._id).
                one('profiles', 'FABRICATION_CLIENT').remove()
        }
        $scope.account.contacts.splice(this.$index, 1);
    };

    $scope.save = function() {

        if ($scope.account._id) {
            $scope.account.put().then(function() {
                $scope.saveContacts();
            });
        } else {
            Restangular.all('accounts').post($scope.account).then(function(data) {
                $scope.account._id = data._id;
                $scope.saveContacts();
            });
        }
        $location.path('/clients');
    };
});