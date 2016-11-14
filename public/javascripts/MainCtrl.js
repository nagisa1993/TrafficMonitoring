/**
 * Created by edward on 10/21/16.
 * Edit-contributer mahaiyue.
 */
var mainCtrl = angular.module('MainCtrl', ['uiGmapgoogle-maps', 'chart.js']);

mainCtrl.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      tooltipFillColor: '#EEE',
      tooltipFontColor: '#000',
      tooltipFontSize: 12,
      tooltipCornerRadius: 3,
      responsive: true
    });
  }]);

mainCtrl.controller('MainCtrl', function($scope, $http, $log, $timeout, uiGmapGoogleMapApi, uiGmapIsReady) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.formData = {};

    // var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Traffic/Incidents/37,-105,45,-94?key=Aski4bckJ0njTKhPccFX4APdYOe6AXI8_65EC2WrAWTT0ntUgIuQiRStrmkrwzQW&jsonp=JSON_CALLBACK";
    // function CallRestService(request, callback) {
    //     $http.jsonp(request)
    //         .success(function (r) {
    //             callback(r);
    //         })
    //         .error(function (data, status, error, thing) {
    //             alert(error);
    //         });
    // };
    //
    // CallRestService(geocodeRequest, GeocodeCallback);
    //
    // function GeocodeCallback(result) {
    //     // var rawdata = JSON.stringify(result);
    //     // console.log(rawdata);
    //     var rawincidents = result;
    //     // console.log(rawincidents);
    //     $scope.incidents = [];
    //     angular.forEach(result.resourceSets[0].resources, function (item) {
    //         var newincident = {
    //             "location": {
    //                 "Lat": item.point.coordinates[0],
    //                 "Lng": item.point.coordinates[1]
    //             },
    //             // do slicing and get millisecond integer
    //             "start": millToUTC(parseInt(item.start.substring(6,item.start.length-2))),
    //             "end": millToUTC(parseInt(item.end.substring(6,item.end.length-2))),
    //             "severity": item.severity
    //         }
    //         console.log(newincident);
    //         $scope.incidents.push(newincident);
            // $http.post('/api/incidents', newincident)
            //     .success(function (data) {
            //         // Once complete, clear the form (except location)
            //     })
            //     .error(function (data) {
            //         console.log('Error: ' + data);
            //     });
        // });
        // console.log(JSON.stringify($scope.incidents));
    // };



    // function millToUTC(millseconds) {
    //     var oneSecond = 1000;
    //     var oneMinute = oneSecond * 60;
    //     var oneHour = oneMinute * 60;
    //     var oneDay = oneHour * 24;
    //
    //     var seconds = Math.floor((millseconds % oneMinute) / oneSecond);
    //     var minutes = Math.floor((millseconds % oneHour) / oneMinute);
    //     var hours = Math.floor((millseconds % oneDay) / oneHour);
    //     var days = Math.floor(millseconds / oneDay);
    //
    //     var timeString = '';
    //     if (days !== 0) {
    //         timeString += (days !== 1) ? (days + ' days ') : (days + ' day ');
    //     }
    //     if (hours !== 0) {
    //         timeString += (hours !== 1) ? (hours + ' hours ') : (hours + ' hour ');
    //     }
    //     if (minutes !== 0) {
    //         timeString += (minutes !== 1) ? (minutes + ' minutes ') : (minutes + ' minute ');
    //     }
    //     if (seconds !== 0 || millseconds < 1000) {
    //         timeString += (seconds !== 1) ? (seconds + ' seconds ') : (seconds + ' second ');
    //     }
    //
    //     return timeString;
    // };



/*-------------------------------------------------------------------------------------------------------*/
/*                                          Draw chart                                                   */
/*-------------------------------------------------------------------------------------------------------*/
    // After obtaining traffic data from db, draw 2 line charts
    $scope.labels1 = ['0', '3:00', '6:00', '9:00', '12:00', '15:00', '18:00', '21:00', '24:00'];
    $scope.chartdata1 = [];
    $http.get('/api/incidents')
        .success(function(data){
            let pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            for(let i = 0; i < data.length; i++){             
                switch(data[i].startTime.substr(11).substr(0, 2)){
                    case "00":
                    case "01":
                    case "02":
                        pattern[0]++;
                        break;
                    case "03":
                    case "04":
                    case "05":
                        pattern[1]++;
                        break;
                    case "06":
                    case "07":
                    case "08":
                        pattern[2]++;
                        break;
                    case "09":
                    case "10":
                    case "11":
                        pattern[3]++;
                        break;
                    case "12":
                    case "13":
                    case "14":
                        pattern[4]++;
                        break;
                    case "15":
                    case "16":
                    case "17":
                        pattern[5]++;
                        break;
                    case "18":
                    case "19":
                    case "20":
                        pattern[6]++;
                        break;
                    case "21":
                    case "22":
                    case "23":
                        pattern[7]++;
                        break;   
                }
            pattern[8] = pattern[0];             
            }
            $scope.chartdata1.push(pattern);
        })
        .error(function(data){
            console.log('Error' + data);
        });
    $scope.labels2 = ['0', '3:00', '6:00', '9:00', '12:00', '15:00', '18:00', '21:00', '24:00'];
    $scope.chartdata2 = [[0,0,0,0,0,0,0,0,0]];
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Draw map                                                     */
/*-------------------------------------------------------------------------------------------------------*/
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
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Form Controller                                              */
/*-------------------------------------------------------------------------------------------------------*/
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
        $scope.directionsService.route(request, function (response, status) {
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
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Address Autocomplete                                         */
/*-------------------------------------------------------------------------------------------------------*/
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