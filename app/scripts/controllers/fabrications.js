'use strict';

var app = angular.module('fabrications', ['ngGrid', 'ui.date']).
    config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
        when('/fabrications', {templateUrl: '/views/fabrications/list.html', controller: 'FabricationsListCtrl'}).
        when('/fabrications/add', {
            templateUrl: '/views/fabrications/detail.html',
            controller: 'FabricationDetailCtrl',
            resolve: {
                fabrication: function() {
                    return new Object();
                }
            }
        }).
        when('/fabrications/:id', {
            templateUrl: '/views/fabrications/detail.html', controller: 'FabricationDetailCtrl',
            resolve: {
                fabrication: function(Restangular, $route) {
                    return Restangular.one('fabrications', $route.current.params.id).get();
                }
            }
        });
    }]);

app.controller('FabricationsListCtrl', function($scope, Restangular) {
    $scope.myData = Restangular.all('fabrications').getList();

    $scope.getAttachment = function(idFab, idAtt) {
        var url = Restangular.one('fabrications', idFab).one('attachments', idAtt).getRestangularUrl();
        window.location.replace(url);
    };

    $scope.columnsDef = [
        {
            field: '_id',
            displayName: 'N° Fabrication',
            cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>' +
                '<a href="/fabrications/{{row.getProperty(col.field)}}">{{row.getProperty(col.field)}}</a>' +
                '</span></div>'
        },
        {
            field: 'client.name',
            displayName: 'Client'
        },
        {
            field: 'clientOrderId',
            displayName: 'N° d\'ordre'
        },
        {
            field: 'fabStartDate',
            displayName: 'Début fabrication',
            cellFilter: 'date:"short"'
        },
        {
            field: 'fabEndDate',
            displayName: 'Fin fabrication',
            cellFilter: 'date:"short"'
        },
        {
            field: 'steDate',
            displayName: 'Date stérilisation',
            cellFilter: 'date:"short"'
        },
        {
            field: 'attachment',
            displayName: 'Dossier de fabrication',
            cellTemplate:
                '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>' +
                    '<a href="#" ng-show="row.getProperty(col.field)"' +
                    'ng-click="getAttachment(row.getProperty(\'_id\'), row.getProperty(\'attachment\'))">Télécharger</a>' +
                    '</span></div>'
        }
    ];

    $scope.gridOptions = {
        data : 'myData',
        columnDefs: 'columnsDef',
        rowHeight: 60,
        enableRowSelection: false,
        showFooter: true,
        showFilter: true,
        sortInfo: {fields: ['_id'], directions: ['desc']}
    };
});


app.controller('FabricationDetailCtrl', function($scope, $window, $location, $filter, fabrication, Restangular) {
    // This is used to get the file in the form
    window.scope = $scope;
    $scope.setFile = function(element) {
        $scope.$apply(function() {
            $scope.theFile = element.files[0];
        });
    };

    $scope.clients = Restangular.all("accounts").getList();

    if (fabrication._id) {
        var original = fabrication;
        $scope.fabrication = Restangular.copy(original);

        $scope.fabStartDate = new Date($scope.fabrication.fabStartDate);
        $scope.fabStartHour = $filter('date')($scope.fabrication.fabStartDate, 'HH');

        $scope.fabEndDate = new Date($filter('date')($scope.fabrication.fabEndDate, 'yyyy-MM-dd'));
        $scope.fabEndHour = $filter('date')($scope.fabrication.fabEndDate, 'HH');

        $scope.steDate = new Date($filter('date')($scope.fabrication.steDate, 'yyyy-MM-dd'));
        $scope.steHour = $filter('date')($scope.fabrication.steDate, 'HH');
    }


    $scope.save = function() {

        if ($scope.fabStartDate) {
            $scope.fabrication.fabStartDate = new Date($scope.fabStartDate);
            if ($scope.fabStartHour) {
                $scope.fabrication.fabStartDate.setHours($scope.fabStartDate.getHours() +
                    parseInt($scope.fabStartHour));
            }
        }

        if ($scope.fabEndDate) {
            $scope.fabrication.fabEndDate = new Date($scope.fabEndDate);
            if ($scope.fabEndHour) {
                $scope.fabrication.fabEndDate.setHours($scope.fabEndDate.getHours() +
                    parseInt($scope.fabEndHour));
            }
        }

        if ($scope.steDate) {
            $scope.fabrication.steDate = new Date($scope.steDate);
            if ($scope.steHour) {
                $scope.fabrication.steDate.setHours($scope.steDate.getHours() +
                    parseInt($scope.steHour));
            }
        }

        if (!$scope.fabrication._id) {
            Restangular.all('fabrications').post($scope.fabrication).then(function() {
                $location.path('/fabrications');
            });
        } else {
            if ($scope.theFile) {
                var headers = new Object();
                headers['Content-Type'] = $scope.theFile.type;
                var queryParams = new Object();
                queryParams.name = $scope.theFile.name;

                Restangular.
                    one('fabrications', fabrication._id).
                    all('attachments').post($scope.theFile, queryParams, headers);
                $scope.fabrication.attachment = $scope.theFile.name;
            }

            $scope.fabrication.put().then(function() {
                $location.path('/fabrications');
            });
        }
    };
});
