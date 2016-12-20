/**
 * Created by mahaiyue on 10/21/16.
 */
var hisCtrl = angular.module('HisCtrl', []);
hisCtrl.controller('HisCtrl', function($scope, $http){
    $scope.labels = ['0:00-4:00', '4:00-8:00', '8:00-12:00', '12:00-16:00', '16:00-20:00', '20:00-24:00'];

    // when landing on the page, get all searching histories and show them
    $http.get('/api/historys')
        .success(function(data) {
            $scope.historys = data;
            
            // group searching history data and update chart
            var a = [0,0,0,0,0,0];
            for(var i = 0; i < data.length; i++){
                var num = data[i].time;
                if(num >= 1 && num < 5)
                    a[0]++;
                if(num >= 5 && num < 9)
                    a[1]++;
                if(num >= 9 && num < 13)
                    a[2]++;
                if(num >= 13 && num < 17)
                    a[3]++;
                if(num >= 17 && num < 21)
                    a[4]++;
                if(num >= 21)
                    a[5]++; 
            }
            $scope.chartdata = a;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // delete a history
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

    // column sorting & toggle span class
    $scope.sortColumn = 'time';
    $scope.reverseSort = false;
    $scope.sortData = function (column) {
        $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
        //$scope.isActive = !$scope.isActive;
        $scope.sortColumn = column;
    }

    // toggle span class
  //   $scope.isActive = false;
  //   $scope.updown = "bottom";
  //   $scope.activeSpan = function() {
  //   $scope.isActive = !$scope.isActive;
  //   if($scope.isActive == true)
  //       $scope.updown = "top";
  //   else
  //       $scope.updown = "bottom";
  // }  
});
