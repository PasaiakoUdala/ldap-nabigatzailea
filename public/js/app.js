/**
 * Created by iibarguren on 5/22/17.
 */

angular.module('ldap', ['ngRoute', 'ngResource'])

    .controller('mainController', function ($scope, $http) {

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