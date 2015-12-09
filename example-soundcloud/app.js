myApp = angular.module('myApp', ['angularSoundManager']);

myApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'pages/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'pages/contact.html',
            controller  : 'contactController'
        });
});

myApp.controller('MainCtrl', ['$scope',
    function($scope) {
        $scope.songs = [];

        SC.initialize({
            client_id: "YOUR-CLIENT-ID-HERE"
        });

        SC.get("/groups/55517/tracks", {
            limit: 5
        }, function(tracks) {
            for (var i = 0; i < tracks.length; i ++) {
                SC.stream( '/tracks/' + tracks[i].id, function( sm_object ){
                    var track = {
                        id: tracks[i].id,
                        title: tracks[i].title,
                        artist: tracks[i].genre,
                        url: sm_object.url
                    };

                    $scope.$apply(function () {
                        $scope.songs.push(track);
                    });
                });
            }
        });
    }
]);