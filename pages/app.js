'use strict';
var myApp = angular.module('myApp', ['angularSoundManager', 'ngRoute']);

myApp.run( function($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if ($rootScope.authToken == null) {
            // no logged user, we should be going to #login
            if ( next.templateUrl == "pages/login.html" || next.templateUrl == "pages/signup.html") {
                // already going to #login or #signup, no redirect needed
            } else {
                // not going to #login, we should redirect now
                $location.path( "/login" );
            }
        }
    });
});

myApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/index.html',
            controller  : 'MainCtrl'
        })

        // route for the login page
        .when('/login', {
            templateUrl : 'pages/login.html',
            controller  : 'loginCtrl'
        })

        .when('/signup', {
            templateUrl : 'pages/signup.html',
            controller  : 'signupCtrl'
        })


});

myApp.controller("signupCtrl", function($scope, $rootScope, $http, $location) {

        $scope.signup = function() {

            $http({
                method: 'POST',
                url: 'http://tunedoor.s156.eatj.com/jaxrs/tunedoorgateway/registerUserProfile',
                data: $.param({email: $scope.email, password : $scope.password, name : $scope.name}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(response) {

                $location.path("/login");
            });
        }
    }
);

myApp.controller("loginCtrl", function($scope, $rootScope, $http, $location) {

        $scope.login = function() {

            $http({
                method: 'POST',
                url: 'http://tunedoor.s156.eatj.com/jaxrs/tunedoorgateway/authenticateUser',
                data: $.param({email: $scope.email, password : $scope.password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function(response) {

                $rootScope.authCode = response.authCode;
                $rootScope.authToken = response.authToken;
                $location.path("/");
            });
        }
    });

myApp.controller('MainCtrl', function($scope, $rootScope, $http) {
        $scope.songs = [];
        $http({
            method: 'POST',
            url: 'http://tunedoor.s156.eatj.com/jaxrs/tunedoorgateway/getSongs',
            headers: {'authCode': $rootScope.authCode, 'authToken' : $rootScope.authToken}
        }).then(function(response) {

            for (var i = 0; i < response.length; i++) {

                var item = {
                    'id' : response[i].id,
                    'title' : response[i].title,
                    'recordedDateTime' : response[i].recordedDateTime
                }
                $scope.songs.append(item);
            }
        });
    });;