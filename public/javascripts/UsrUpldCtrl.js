/**
 * Created by sirun xu on 12/15/16.
*/
/**
 * Created by edward on 10/21/16.
 * Edit-contributer mahaiyue.
 */
var usrUpldCtrl = angular.module('UsrUpldCtrl', ['uiGmapgoogle-maps', 'chart.js']);



usrUpldCtrl.controller('UsrUpldCtrl', function($scope, $http, $log, uiGmapGoogleMapApi, uiGmapIsReady) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []
    $scope.formData = {};

    $http.get('/api/reports')
        .success(function(data){
            $scope.reports = data;
        })
        .error(function(e){
            console.log(e);
        });

/*-------------------------------------------------------------------------------------------------------*/
/*                                          Form Controller                                              */
/*-------------------------------------------------------------------------------------------------------*/
    $scope.update = function() {
        
        var request = {
            location: $scope.ori_detail.geometry.location,
           
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true
        }
       

        $scope.marker = {};

        // Saves the user data to the db
        $http.post('/api/reports', $scope.formData)
            .then(function (data) {
                // Once complete, clear the form (except location)
                $scope.formData = {};

                return $http.get('/api/reports');
                    
                // Because in this case the returned response contains: config, data, headers,
                // status, statusText, __proto__
                // We need to choose data in response                        
            })
            .then(function(res){
                $scope.reports = res.data;
            });
            
    };

    $scope.reset = function() {
        $scope.formData = {};
    }

    $scope.deleteReport = function(id) {
        $http.delete('/api/reports/' + id)
            .success(function(data) {
                $scope.reports = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
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
                case "location":
                    scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
                    google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                        scope.$apply(function () {
                            scope.ori_detail = scope.gPlace.getPlace();
                            model.$setViewValue(element.val());
                        });
                    });
                    break;
               
            }
        }
    };
});