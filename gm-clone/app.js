/**
 * Created by t_boyas on 1/4/17.
 */

var app = angular.module('myApp', ['ngRoute']);
//hello

app.config(function ($routeProvider) {
    $routeProvider
        .when('/inbox', {
            templateUrl: 'views/inbox.html',
            controller: 'InboxCtrl',
            controllerAs: 'inbox'
        })
        .when('/inbox/email/:id', {
            templateUrl: 'views/email.html',
            controller: 'EmailCtrl',
            controllerAs: 'email'
        })
        .otherwise({
            redirectTo: '/inbox'
        });
});


app.controller('InboxCtrl', function($scope, InboxFactory) {
    InboxFactory.getMessages()
        .success(function(jsonData, statusCode) {
            console.log('The request was successful!', statusCode, jsonData);
            // Now add the Email messages to the controller's scope
            $scope.emails = jsonData;
        });
});

app.controller('TestCtrl', function ($scope) {
    // Model and View bindings
    // Small helper function not needed anywhere else
    $scope.title = "This is a title";
});

app.factory('InboxFactory', function InboxFactory ($q, $http, $location) {
    'use strict';
    var exports = {};

    exports.messages = [];

    exports.goToMessage = function(id) {
        if ( angular.isNumber(id) ) {
            // $location.path('inbox/email/' + id)
        }
    }

    exports.deleteMessage = function (id, index) {
        this.messages.splice(index, 1);
    }

    exports.getMessages = function () {
        var deferred = $q.defer();
        $http.get('json/emails.json')
            .success(function (data) {
                exports.messages = data;
                deferred.resolve(data);
            })
            .error(function (data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    return exports;
});


app.directive('inbox', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: "js/directives/inbox.tmpl.html",
        controllerAs: 'inbox',
        controller: function (InboxFactory) {
            this.messages = [];
            this.goToMessage = function (id) {
                InboxFactory.goToMessage(id);
            };
            this.deleteMessage = function (id, index) {
                InboxFactory.deleteMessage(id, index);
            };
            InboxFactory.getMessages()
                .then( angular.bind( this, function then() {
                    this.messages = InboxFactory.messages;
                })	);
        },
        link: function (scope, element, attrs, ctrl) {
            /*
             by convention we do not $ prefix arguments to the link function
             this is to be explicit that they have a fixed order
             */
        }
    }
});
