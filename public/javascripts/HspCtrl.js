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
    $scope.Markers = [];
    // $http.post('/api/hotspots', $scope.formData)
    //         .success(function (data) {
    //             // Once complete, clear the form (except location)
    //             console.log("ok" + $scope.formData);
    //             let markers = [];
    //             for(let i = 0; i < data.length; i++){
    //                 let newmarker = {};
    //                 newmarker.latitude = data[i].location.lat;
    //                 newmarker.longitude = data[i].location.lng;
    //                 newmarker.id = i;
    //                 newmarker.title = data[i].description;
    //                 markers.push(newmarker);
    //             }      
    //             $scope.Markers = markers;
    //             $scope.events = {
    //                 click: function(marker, eventName, model){
    //                     console.log(marker + " " + eventName + " " + model);
    //                     $scope.window.model = model;
    //                     $scope.window.title = model.title;
    //                     $scope.InfoShow = true;

    //                 }
    //             };
    //             $scope.window = {
    //                 marker: {},
    //                 show: false,
    //                 closeClick: function() {
    //                     this.show = false;
    //                 },
    //                 options: {}, // define when map is ready
    //                 title: ''
    //             };
    //         })
    //         .error(function (data) {
    //             console.log('Error: ' + data);
    // });
    // $scope.closeClick = function () {
    //     this.window = false;
    // };

    
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Form Controller                                              */
/*-------------------------------------------------------------------------------------------------------*/
    $scope.update = function() {
        // get all incidents according to form data
        $http.post('/api/hotspots', $scope.formData)
            .success(function (data) {
                let markers = [];
                for(let i = 0; i < data.length; i++){
                    let newmarker = {};
                    newmarker.latitude = data[i].location.lat;
                    newmarker.longitude = data[i].location.lng;
                    newmarker.place = data[i].toLocation;
                    newmarker.id = i;
                    markers.push(newmarker);
                }      
                $scope.Markers = markers;

                // after we obtain the incidents according to Weather, Day and Severity,
                // send back the results to Results database
                $http.post('/api/results', data)
                    .success(function(dt){
                        console.log("Send incidents data back to Results database");
                    })
                    .error(function(err){
                        console.log('Error: ' + err);
                    });
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });

            // change traffic pattern for all area
            $http.get('/api/results')
                .success(function(data){
                    var a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

                    var incidentobj = function(){
                        this.getobjhour = function(){
                            return this.getHours();
                        };
                        return this;
                    };
                    for(var i = 0; i < data.length; i++){
                        console.log(typeof data[i].created_at);
                        var num = new Date(Date.parse(data[i].created_at)).getUTCHours();
                        a[num]++;
                    }
                    $scope.chartdata1 = [];
                    $scope.chartdata1.push(a);
                })
                .error(function(err){
                    console.log('Error: ' + err);
                })

            $scope.events = {
                    click: function(marker, eventName, model){
                        // eventName is the name of event, e.g.: "click"
                        // model is the marker that we click, it contain the key we save before
                        // marker is google map marker object, we can define the attr, like "marker.showWindow=true"
                        console.log(model.place);
                        $scope.place = model.place;
                        var clickedmark = {};
                        clickedmark.place = model.place;
                        $http.post('/api/incidents', clickedmark)
                            .success(function(data){
                                $scope.chartdata2 = [];
                                $scope.chartdata2.push(data);
                            })
                            .error(function(data){
                                console.log('Error: ' + data);
                            });
                    }
            };
    };

    $scope.reset = function() {
        $scope.formData = {};
    }
});