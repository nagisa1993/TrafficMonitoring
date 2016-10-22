/**
 * Created by edward on 10/21/16.
 */
var mainCtrl = angular.module('MainCtrl', ['uiGmapgoogle-maps'])
    mainCtrl.controller('MainCtrl', function($scope, $http, $log, $timeout) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.master = {};
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
    };
    $scope.marker = {
        id: 0,
        coords: {
            latitude: 40.523325,
            longitude: -74.458809
        },
        options: {
            draggable: true
        },
        events: {
            dragend: function(marker, eventName, args) {
                var lat = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                $log.log(lat);
                $log.log(lon);

                $scope.marker.options = {
                    draggable: true,
                    labelContent: "",
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };
    $scope.update = function(formdata) {
        $scope.master = angular.copy(formdata);
        // Saves the user data to the db
        $http.post('/api/historys', formdata)
            .success(function (data) {
                // Once complete, clear the form (except location)
                $scope.formData.ori = "";
                $scope.formData.des = "";
                $scope.formData.weather = "";
                $scope.formData.time = "";

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    }
    $scope.reset = function() {
        $scope.formData = {};
    }
});