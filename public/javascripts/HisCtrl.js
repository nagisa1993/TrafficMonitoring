/**
 * Created by mahaiyue on 10/21/16.
 */
var hisCtrl = angular.module('HisCtrl', []);
hisCtrl.controller('HisCtrl', function($scope, $http){
    // when landing on the page, get all histories and show them
    $http.get('/api/historys')
        .success(function(data) {
            $scope.historys = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // delete a history after checking it
    $scope.deleteHistory = function(id) {
        $http.delete('/api/historys/' + id)
            .success(function(data) {
                $scope.historys = data;
                //console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
});
