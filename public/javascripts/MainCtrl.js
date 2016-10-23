/**
 * Created by edward on 10/21/16.
 */
var mainCtrl = angular.module('MainCtrl', ['uiGmapgoogle-maps']);
mainCtrl.controller('MainCtrl', function($scope, $http, $log, $timeout, uiGmapGoogleMapApi, uiGmapIsReady) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.formData = {};
    $scope.map = {
        center: {
            latitude: 40.523325,
            longitude: -74.458809
        },
        markClick: false,
        zoom: 13,
        fit: true,
        pan: 1,
        events: {
            tilesloaded: function (maps, eventName, args) {
            },
            dragend: function (maps, eventName, args) {
            },
            zoom_changed: function (maps, eventName, args) {
            }
        }
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
            dragend: function (marker, eventName, args) {
                var lat = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                // $log.log(lat);
                // $log.log(lon);

                $scope.marker.options = {
                    draggable: true,
                    labelContent: "",
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi
        .then(function(maps) {
            $scope.directionsService = new maps.DirectionsService();
            $scope.directionsDisplay = new google.maps.DirectionsRenderer();
        });

    uiGmapIsReady.promise(1)                     // this gets all (ready) map instances - defaults to 1 for the first map
        .then(function(instances) {
            instances.forEach(function(inst) {   // instances is an array object
                $scope.maps = inst.map;
                $scope.directionsDisplay.setMap(inst.maps); // if only 1 map it's found at index 0 of array
            });
    });

    $scope.update = function() {
        // console.log($scope.ori_detail.name);
        // console.log($scope.des_detail.name);
        var request = {
            origin: $scope.ori_detail.geometry.location,
            destination: $scope.des_detail.geometry.location,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true
        }
        $scope.directionsDisplay.setMap($scope.maps);
        $scope.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                $scope.directionsDisplay.setDirections(response);
                // for (var i = 0, len = response.routes.length; i < len; i++) {
                //     new google.maps.DirectionsRenderer({
                //         map: $scope.maps,
                //         directions: response,
                //         routeIndex: i
                //     });
                // }
            }
        });

        $scope.marker = {};

        // Saves the user data to the db
        $http.post('/api/historys', $scope.formData)
            .success(function (data) {
                // Once complete, clear the form (except location)
                $scope.formData = {};

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.reset = function() {
        $scope.formData = {};
    }
});


mainCtrl.directive('googleplace',function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            switch(element[0].id){
                case "origin":
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                        scope.$apply(function () {
                            scope.ori_detail = scope.gPlace.getPlace();
                            model.$setViewValue(element.val());
                        });
                    });
                    break;
                case "destination":
                    scope.gPlace2 = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(scope.gPlace2, 'place_changed', function () {
                        scope.$apply(function () {
                            scope.des_detail = scope.gPlace2.getPlace();
                            model.$setViewValue(element.val());
                        });
                    });
                    break;
            }
        }
    };
});