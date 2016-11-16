/**
 * Created by mahaiyue on 10/22/16.
 */
var hotCtrl = angular.module('HspCtrl', ['uiGmapgoogle-maps', 'chart.js']);

hotCtrl.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      tooltipFillColor: '#EEE',
      tooltipFontColor: '#000',
      tooltipFontSize: 12,
      tooltipCornerRadius: 3,
      responsive: true
    });
  }]);

hotCtrl.controller('HspCtrl', function($scope, $http, $log, $timeout, uiGmapGoogleMapApi, uiGmapIsReady) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.formData = {};
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Draw chart                                                   */
/*-------------------------------------------------------------------------------------------------------*/
    // After obtaining traffic data from db, draw 2 line charts
    $scope.labels1 = ['0: 00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', 
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    $scope.chartdata1 = [];
    $http.get('/api/incidents')
        .success(function(data){
            let pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for(let i = 0; i < data.length; i++){             
                switch(data[i].startTime.substr(11).substr(0, 2)){
                    case "00":
                        pattern[0]++;
                        break;
                    case "01":
                        pattern[1]++;
                        break;
                    case "02":
                        pattern[2]++;
                        break;
                    case "03":
                        pattern[3]++;
                        break;
                    case "04":
                        pattern[4]++;
                        break;
                    case "05":
                        pattern[5]++;
                        break;
                    case "06":
                        pattern[6]++;
                        break;
                    case "07":
                        pattern[7]++;
                        break;
                    case "08":
                        pattern[8]++;
                        break;
                    case "09":
                        pattern[9]++;
                        break;
                    case "10":
                        pattern[10]++;
                        break;
                    case "11":
                        pattern[11]++;
                        break;
                    case "12":
                        pattern[12]++;
                        break;
                    case "13":
                        pattern[13]++;
                        break;
                    case "14":
                        pattern[14]++;
                        break;
                    case "15":
                        pattern[15]++;
                        break;
                    case "16":
                        pattern[16]++;
                        break;
                    case "17":
                        pattern[17]++;
                        break;
                    case "18":
                        pattern[18]++;
                        break;
                    case "19":
                        pattern[19]++;
                        break;
                    case "20":
                        pattern[20]++;
                        break;
                    case "21":
                        pattern[21]++;
                        break;
                    case "22":
                        pattern[22]++;
                        break;
                    case "23":
                        pattern[23]++;
                        break;   
                }             
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
        zoom: 8,
        fit: true,
        pan: 1,
        // events: {
        //     tilesloaded: function (maps, eventName, args) {
        //     },
        //     dragend: function (maps, eventName, args) {
        //     },
        //     zoom_changed: function (maps, eventName, args) {
        //     }
        // }
    };
    let markers = [];
    $http.get('/api/weathers')
    .success(function(data){
        for(let i = 0; i < data.length; i++){
            let newmarker = {};
            newmarker.latitude = data[i].location.lat;
            newmarker.longitude = data[i].location.lng;
            newmarker.id = i;
            markers.push(newmarker);
        }       
    })
    .error(function(data){
        console.log('Error' + data);
    });
    $scope.Markers = markers;
    // $scope.marker = {
    //     id: 0,
    //     coords: {
    //         latitude: 40.523325,
    //         longitude: -74.458809
    //     },
    //     options: {
    //         draggable: true
    //     },
    //     events: {
    //         dragend: function (marker, eventName, args) {
    //             var lat = marker.getPosition().lat();
    //             var lon = marker.getPosition().lng();
    //             // $log.log(lat);
    //             // $log.log(lon);

    //             $scope.marker.options = {
    //                 draggable: true,
    //                 labelContent: "",
    //                 labelAnchor: "100 0",
    //                 labelClass: "marker-labels"
    //             };
    //         }
    //     }
    // };

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
        $http.post('', $scope.formData)
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