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

    $scope.isPanelSet = false;
    $scope.checkbox = [true, true, true, true, true]; // severity filter checkboxes
    $scope.tmp = []; // tmp Markers objects
    $scope.querydata = []; // query data response from API
    var dataPoints = []; // for Heatmap usage
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

    $scope.labels3 = ['Severity Level 0', 'Severity Level 1', 'Severity Level 2', 'Severity Level 3', 'Severity Level 4'];
    $scope.chartdata3 = [0, 0, 0, 0, 0];
    $scope.labels4 = ['Construction','Incident/Accident','Congestion/Flow','Event'];
    $scope.chartdata4 = [0, 0, 0, 0]; 
/*-------------------------------------------------------------------------------------------------------*/
/*                                   Draw map & map Initialization                                       */
/*-------------------------------------------------------------------------------------------------------*/
    $scope.map = {
        center: {
            latitude: 40.523325,
            longitude: -74.458809
        },
        markClick: false,
        zoom: 10,
        fit: true,
        pan: 1,

        window: {
            model: {},
            show: false,
            coords:{
                latitude: 40.523325,
                longitude: -74.458809
            }
      }
    };

    $scope.Markers = [];

    uiGmapIsReady.promise(1)                     // this gets all (ready) map instances - defaults to 1 for the first map
        .then(function(instances) {
            instances.forEach(function(inst) {   // instances is an array object
                $scope.maps = inst.map;
                $scope.heatmap = new google.maps.visualization.HeatmapLayer({
                data: dataPoints,
                map: inst.map
                });
                $scope.heatmap.set('radius',5);
                $scope.heatmap.set('opacity', 0.7);
            });
    });
    
/*-------------------------------------------------------------------------------------------------------*/
/*                                          Form Controller                                              */
/*-------------------------------------------------------------------------------------------------------*/
    $scope.update = function() {
        // get all incidents according to form data
        $http.post('/api/hotspots', $scope.formData)
            .success(function (data) {
                $scope.querydata = data;
                let markers = [];
                for(let i = 0; i < data.length; i++){
                    let newmarker = {};
                    newmarker.latitude = data[i].location.lat;
                    newmarker.longitude = data[i].location.lng;
                    dataPoints.push(new google.maps.LatLng(data[i].location.lat, data[i].location.lng));
                    newmarker.place = data[i].toLocation;
                    newmarker.id = i;
                    newmarker.show = false;
                    newmarker.severity = data[i].severity;
                    newmarker.title = data[i].roadName + ', ' + data[i].type.toLowerCase();
                    switch (data[i].severity){
                        case 0:
                            newmarker.icon = "../images/bluemarker.png";
                            break;
                        case 1:
                            newmarker.icon = "../images/greenmarker.png";
                            break;
                        case 2:
                            newmarker.icon = "../images/yellowmarker.png";
                            break;
                        case 3:
                            newmarker.icon = "../images/orangemarker.png";
                            break;
                        case 4:
                            newmarker.icon = "../images/redmarker.png";
                            break;
                    }
                    markers.push(newmarker);
                }  
                // save all markers to tmp for filtering in the future
                $scope.tmp = markers; 
                // update Markers 
                $scope.Markers = markers;
                // update Heatmap
                $scope.heatmap = new google.maps.visualization.HeatmapLayer({
                    data: dataPoints,
                    map: $scope.maps
                });
                dataPoints = []; // clear datapoints for reuse

                // update chart 1
                var a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                for(var i = 0; i < data.length; i++){
                        var num = new Date(Date.parse(data[i].created_at)).getHours();
                        a[num]++;
                    }
                    $scope.chartdata1 = [];
                    $scope.chartdata1.push(a);
                })
                .error(function(err){
                    console.log('Error: ' + err);
                });


            $scope.events = {
                    click: function(marker, eventName, model){
                        $scope.isPanelSet = true;
                        // eventName is the name of event, e.g.: "click"
                        // model is the marker that we click, it contain the key we save before
                        // marker is google map marker object, we can define the attr, like "marker.showWindow=true"
                        $scope.place = model.place;
                        
                        // open marker infowindow
                        $scope.map.window.model = model;
                        $scope.map.window.coords.latitude = model.latitude;
                        $scope.map.window.coords.longitude = model.longitude;
                        $scope.title = model.title;
                        $scope.map.window.show = true;
                       
                        var results_2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                        var results_3 = [0,0,0,0,0];
                        var results_4 = [0,0,0,0];

                        // update chart 2, 3, 4
                        var containplace = $scope.querydata.filter(function(obj){
                            return obj.fromLocation == model.place || obj.toLocation == model.place;
                        });

                        for(let i = 0; i < containplace.length; i++){
                            var num_time = new Date(Date.parse(containplace[i].created_at)).getHours();
                            results_2[num_time]++;

                            results_3[containplace[i].severity]++;

                            switch(containplace[i].type){
                                case 'Construction':
                                    results_4[0]++;
                                    break;
                                case 'Incident/Accident':
                                    results_4[1]++;
                                    break;
                                case 'Congestion':
                                    results_4[2]++;
                                    break;
                                case 'Event':
                                    results_4[3]++;
                                    break;
                            }
                        }
                        $scope.chartdata2 = [];
                        $scope.chartdata2.push(results_2);

                        $scope.chartdata3 = results_3;
                        $scope.chartdata4 = results_4;
                    }
            };

    };

    $scope.reset = function() {
        $scope.formData = {};
    }

/*-------------------------------------------------------------------------------------------------------*/
/*                                              Checkbox                                                 */
/*-------------------------------------------------------------------------------------------------------*/  
    $scope.$watch('checkbox', function(newvar, oldvar) {
        let check = [];
        newvar.forEach(function(e, index){
            if(e == true)
                check.push(index);
        });

        if(check.length == 0)
            $scope.Markers = [];
        else{
            $scope.Markers = [];
            check.forEach(function(e){
                $scope.Markers = $scope.Markers.concat($scope.tmp.filter(function(obj){
                    return obj.severity == e;
                }));
            });
            //console.log($scope.Markers);
        }

    }, true); 
});