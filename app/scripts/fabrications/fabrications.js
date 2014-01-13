'use strict';

var app = angular.module('fabrications', ['ui.date']).
    config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
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
            templateUrl: '/scripts/fabrications/partials/detail.html', controller: 'FabricationDetailCtrl',
            resolve: {
                fabrication: function(Restangular, $route) {
                    return Restangular.one('fabrications', $route.current.params.id).get();
                }
            }
        });
    }]);

app.controller('FabricationsListCtrl', function($scope, Restangular, Permissions, $http) {

    Permissions.userHasRight('WRITE_FABRICATION').then(function(result) {
        $scope.displayFabricationEditLink = result;
    });


    Restangular.all('fabrications').getList().then(function(data){
        $scope.fabrications = data;
    });

    $scope.getAttachment = function(idFab, idAtt) {
        Restangular.one('fabrications', idFab).one('attachments', idAtt).withHttpConfig({responseType: 'blob'}).
            get().then(function(response) {
                // trick to set the filename when downloading the file
                var downloadLink = document.createElement("a");
                downloadLink.href = (window.URL || window.webkitURL).createObjectURL(response);
                downloadLink.download = idAtt;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
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

    var clients = new Array();
    Restangular.all("accounts").getList().then(function(accounts){
        angular.forEach(accounts, function(account){
            var minAccount = new Object();
            minAccount._id = account._id;
            minAccount.name = account.name;
            clients.push(minAccount);
        });
        $scope.clients = clients;
    });

    if (fabrication._id) {
        var original = fabrication;
        $scope.fabrication = Restangular.copy(original);

        if ($scope.fabrication.fabStartDate) {
            $scope.fabStartDate = new Date($scope.fabrication.fabStartDate);
            $scope.fabStartHour = $filter('date')($scope.fabrication.fabStartDate, 'HH');
        }

        if ($scope.fabrication.fabEndDate) {
            $scope.fabEndDate = new Date($filter('date')($scope.fabrication.fabEndDate, 'yyyy-MM-dd'));
            $scope.fabEndHour = $filter('date')($scope.fabrication.fabEndDate, 'HH');
        }

        if ($scope.fabrication.steDate) {
            $scope.steDate = new Date($filter('date')($scope.fabrication.steDate, 'yyyy-MM-dd'));
            $scope.steHour = $filter('date')($scope.fabrication.steDate, 'HH');
        }
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
