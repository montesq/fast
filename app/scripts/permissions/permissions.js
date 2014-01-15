'use strict';

var app = angular.module('permissionsModule',['restangular']);

app.factory('Permissions', ['$filter', '$q', 'Restangular', function($filter, $q, Restangular) {

    var existsRightInProfiles = function(profiles, right) {
        var filteredProfiles = $filter('filter')(
            profiles,
            function(value) {
                return value.rights.indexOf(right) !== -1;
            });
        return filteredProfiles.length !== 0;
    };

    var userHasRight = function(right) {
        var profiles = JSON.parse(localStorage.getItem('profiles'));
        var deferred = $q.defer();
        if(!profiles) {
            Restangular.all('profiles').getList().then(function(data) {
                localStorage.setItem('profiles', JSON.stringify(data));
                deferred.resolve(existsRightInProfiles(data, right));
            });
        } else {
            deferred.resolve(existsRightInProfiles(profiles, right));
        }

        return deferred.promise;
    };

    return {
        userHasRight: userHasRight
    };
}]);
