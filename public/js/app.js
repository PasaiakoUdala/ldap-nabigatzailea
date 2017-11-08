/**
 * Created by iibarguren on 5/22/17.
 */

var app = angular.module('ldap', ['ngRoute', 'ngResource'])

app.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'saila.html',
            controller: 'mainController'
        })

        .when('/erabiltzaileak', {
            templateUrl: 'erabiltzaileak.html',
            controller: 'erabiltzaileakController'
        })

});

app.controller('mainController', function ($scope, $http) {

        $http.get('/api/sailak').then(function (result) {
            $scope.sailak = result.data;
            $scope.groupandusers = null;
            $scope.rolesandusers = null;
            $scope.roleusers = null;
            $scope.currentUser = null;
        });

        $scope.getGroupAndUsers = function (cn) {

            $http.get('/api/getgroupandusers/' + cn).then(function (result) {
                $scope.groupandusers = result.data;
                $scope.rolesandusers = null;
                $scope.roleusers = null;
                $scope.currentUser = null;
            });
        }

        $scope.getRolesAndUsers = function (cn) {
            $http.get('/api/getgroupandusers/' + cn).then(function (result) {
                $scope.rolesandusers = result.data;
                $scope.roleusers = null;
                $scope.currentUser = null;
            });
        }

        $scope.getRoleUsers = function (cn) {
            $http.get('/api/getgroupandusers/' + cn).then(function (result) {
                $scope.roleusers = result.data;
                $scope.currentUser = null;
            });
        }

        $scope.userInfo = function(user) {
            $scope.currentUser = user;
        }

        $scope.selectedSaila = -1;
        $scope.selectSaila= function(index) {
            $scope.selectedTaldea = -1;
            $scope.selectedRol = -1;
            $scope.selectedUser = -1;
            $scope.selectedSaila = index;
        };

        $scope.selectedTaldea = -1;
        $scope.selectTaldea= function(index) {
            $scope.selectedRol = -1;
            $scope.selectedUser = -1;
            $scope.selectedTaldea = index;
        };

        $scope.selectedRol = -1;
        $scope.selectRol= function(index) {
            $scope.selectedUser = -1;
            $scope.selectedRol = index;
        };

        $scope.selectedUser = -1;
        $scope.selectUser= function(index) {
            $scope.selectedUser = index;
        };

    });

app.controller('erabiltzaileakController', function ($scope, $http) {

    $http.get('/api/users').then(function (result) {
        $scope.users = result.data;
    });
    $scope.usergroups=[];
    $scope.getForest = function (user) {
        $scope.searchText = user;
        $http.get('/api/usergroups/' + user).then(function (result) {
            console.log(result.data);

            var log = [];

            // utsuneak sortu
            if ($scope.selectedSaila > 2) {
                for (i = 0; i < $scope.selectedSaila - 2; i++) {
                    log.push('skip'+i);
                }
            }

            angular.forEach(result.data, function(value, key) {
                console.log(value.cn);
                this.push(value.cn);
            }, log);

            $scope.usergroups = log;
            $scope.selectUser(0);
            console.log("SelectdSaila: " + $scope.selectedSaila);
        });
    };


    $scope.userInfo = function (user) {
        $scope.currentUser = user;
    };

    $scope.selectedSaila = -1;
    $scope.selectSaila= function(index) {
        $scope.selectedTaldea = -1;
        $scope.selectedRol = -1;
        $scope.selectedUser = -1;
        $scope.selectedSaila = index;
    };

    $scope.selectedTaldea = -1;
    $scope.selectTaldea= function(index) {
        $scope.selectedRol = -1;
        $scope.selectedUser = -1;
        $scope.selectedTaldea = index;
    };

    $scope.selectedRol = -1;
    $scope.selectRol= function(index) {
        $scope.selectedUser = -1;
        $scope.selectedRol = index;
    };

    $scope.selectedUser = -1;
    $scope.selectUser= function(index) {
        $scope.selectedUser = index;
    };

});