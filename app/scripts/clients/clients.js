'use strict';

var app = angular.module('clients', []).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/clients', {templateUrl: '/scripts/clients/partials/list.html', controller: 'ClientsListCtrl'}).
        when('/clients/add', {
            templateUrl: '/scripts/clients/partials/detail.html',
            controller: 'ClientDetailCtrl',
            resolve: {
                account: function() {
                    return new Object();
                }
            }
        }).
        when('/clients/:id', {
            templateUrl: '/scripts/clients/partials/detail.html',
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
        $scope.accounts = data;
    });
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