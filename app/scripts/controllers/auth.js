'use strict';

var app = angular.module('auth', []);

app.controller('AuthCtrl', function($scope, $rootScope, $http, Restangular) {
    $scope.currentUser = localStorage.getItem('email');

    $scope.authRequest = function() {
        navigator.id.request({
            siteName: 'Steriservices'
        });
    };

    $scope.authLogout = function() {
        navigator.id.logout();
    };

    $scope.serverVerifyAssertion = function(assertion) {
        Restangular.all('tokens').post({'assertion': assertion}).then(function(data) {
            localStorage.setItem('email', data.email);
            localStorage.setItem('X-Auth-Token', data['X-Auth-Token']);
            window.location.reload();
        }, function(data) {
            navigator.id.logout();
            console.log('Login failure: ' + data.toSource());
        });
    };

    $scope.serverLogout = function() {
        Restangular.one('tokens', '').remove().then(function(data) {
                localStorage.removeItem('email');
                localStorage.removeItem('X-Auth-Token');
                window.location.reload();
            }, function(data) {
                console.log('Logout failure: ' + data.toSource());
            }
        );
    };

    navigator.id.watch({
        loggedInUser: $scope.currentUser,
        onlogin: $scope.serverVerifyAssertion,
        onlogout: $scope.serverLogout
    });
});
