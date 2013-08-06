'use strict';

var app = angular.module('fabrications', ['ngGrid', 'ui.date']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/fabrications', {templateUrl: '/views/fabrications/list.html', controller: 'FabricationsListCtrl'}).
        when('/fabrications/add', {templateUrl: '/views/fabrications/detail.html', controller: 'FabricationAddCtrl'}).
        when('/fabrications/:id', {
            templateUrl: '/views/fabrications/detail.html', controller: 'FabricationDetailCtrl',
            resolve: {
                account: function(Restangular, $route){
                    return Restangular.one('fabrications', $route.current.params.id).get();
                }
            }
        });
    }]);

app.controller('FabricationsListCtrl', function($scope, Restangular) {
    $scope.myData = Restangular.all("fabrications").getList();

    $scope.columnsDef = [
        {
            field: 'name',
            displayName: 'N° Ordre',
            cellTemplate: '<a href="/fabrications/{{row.getProperty(\'_id\')}}">{{row.getProperty(col.field)}}</a>'
        },
        {
            field: 'client',
            displayName: 'Client'
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

app.controller('FabricationAddCtrl', function($scope, $location, Restangular) {
    $scope.clients = Restangular.all("accounts").getList();

    $scope.save = function() {
        if ($scope.fabStartDate) {
            $scope.fabrication.fabStartDate = new Date($scope.fabStartDate);
            if ($scope.fabStartHour) {
                $scope.fabrication.fabStartDate.setHours($scope.fabStartDate.getHours() +
                    parseInt($scope.fabStartHour));
            }
        }

        Restangular.all('fabrications').post($scope.fabrication).then(function() {
            $location.path('/fabrications');
        });
    };
});

app.controller('FabricationDetailCtrl', function($scope, $location, account, Restangular) {
    var original = fabrication;
    $scope.fabrication = Restangular.copy(original);

    $scope.save = function() {
        $scope.fabrication.put().then(function() {
            $location.path('/fabrications');
        });
    };
});