'use strict';

var app = angular.module('permissionsModule',[]);

app.factory('Permissions', ['$filter', function($filter) {
    var profiles = [{'rights' : ['READ_ACCOUNT', 'READ_FABRICATION', 'WRITE_FABRICATION']}];

    return {
        userHasRight: function(right) {
            var filteredProfiles = $filter('filter')(profiles, function(value) { return value.rights.indexOf(right) != -1})
            return filteredProfiles.length != 0;
        }
    };
}]);
