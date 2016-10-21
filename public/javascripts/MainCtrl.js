/**
 * Created by edward on 10/21/16.
 */
var mainCtrl = angular.module('MainCtrl', ['uiGmapgoogle-maps'])
    mainCtrl.controller('MainCtrl', function($scope, $interval) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    $scope.map = {
        center: {
            latitude: 40.523325,
            longitude: -74.458809
        },
        markClick : false,
        zoom : 13,
        fit : true
    }
});