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
        Restangular.all('login').post({'assertion': assertion}).then(function(data) {
            localStorage.setItem('email', data.email);
            window.location.reload();
        }, function(data) {
            navigator.id.logout();
            console.log('Login failure: ' + data.toSource());
        });
    };

    $scope.serverLogout = function() {
        Restangular.all('logout').post().then(function(data) {
                localStorage.removeItem('email');
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
