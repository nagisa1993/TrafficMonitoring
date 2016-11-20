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
    $scope.formData = {
        "day": "All",
        "weather": "All",
        "severity": "All"
    };
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Draw chart                                                   */
/*-------------------------------------------------------------------------------------------------------*/
    // After obtaining traffic data from db, draw 2 line charts
    $scope.labels1 = ['0: 00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', 
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    $scope.chartdata1 = [];
    $http.get('/api/incidents')
        .success(function(data){
            $scope.chartdata1.push(data);
        })
        .error(function(data){
            console.log('Error' + data);
        });
    $scope.labels2 = ['0: 00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', 
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    $scope.chartdata2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
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
    };

    //$scope.Markers = [];
    let markers = [];
    $http.post('/api/hotspots', $scope.formData)
            .success(function (data) {
                // Once complete, clear the form (except location)
                console.log("ok" + $scope.formData);
                let markers = [];
                for(let i = 0; i < data.length; i++){
                    let newmarker = {};
                    newmarker.latitude = data[i].location.lat;
                    newmarker.longitude = data[i].location.lng;
                    newmarker.id = i;
                    markers.push(newmarker);
                }      
                $scope.Markers = markers;
            })
            .error(function (data) {
                console.log('Error: ' + data);
    });

    
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Form Controller                                              */
/*-------------------------------------------------------------------------------------------------------*/
    $scope.update = function() {
        // get all incidents according to form data
        $http.post('/api/hotspots', $scope.formData)
            .success(function (data) {
                // Once complete, clear the form (except location)
                let markers = [];
                for(let i = 0; i < data.length; i++){
                    let newmarker = {};
                    newmarker.latitude = data[i].location.lat;
                    newmarker.longitude = data[i].location.lng;
                    newmarker.id = i;
                    markers.push(newmarker);
                }      
                $scope.Markers = markers;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.reset = function() {
        $scope.formData = {};
    }
});