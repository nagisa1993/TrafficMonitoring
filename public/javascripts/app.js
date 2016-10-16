var app = angular.module("MyApp", ['ngRoute']); //Remember to add ['ngRoute']!!!!!

app.config(function($routeProvider, $locationProvider) {
    //$locationProvider.hashPrefix('!');
    $routeProvider.
      when("/", {
        templateUrl: "partials/index.html",
        controller: "MainCtrl"
      }).
      when("/history", { 
        templateUrl: "partials/history.html",
        controller: "HisCtrl"
      }).
      when("/help", { 
        templateUrl: "partials/help.html" 
      }).
      when("/contact", { 
        templateUrl: "partials/contact.html" 
      }).
      otherwise( { redirectTo: "/" });

      // use the HTML5Mode History API
      $locationProvider.html5Mode(true);
});

//change "active" navbar-columns
app.controller("MainCtrl", function($scope, $location) {
  $scope.menuClass = function(page) {
    var current = $location.path().substring(1);
    console.log($scope.current);
    return page === current ? "active" : "";
  };
  $scope.current = $location.path().substring(1);
  
});