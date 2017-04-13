/**
 * Created by mahaiyue on 10/16/16.
 * Edited by edwards on 10/21/16.
 */
var app = angular.module("MyApp", ['ngRoute', 'uiGmapgoogle-maps', 'MainCtrl', 'HisCtrl', 'HspCtrl', 'UsrUpldCtrl']); //Remember to add ['ngRoute']!!!!!

app.config(function($routeProvider, $locationProvider) {
    //$locationProvider.hashPrefix('!');
    $routeProvider.
      when("/home", {
        templateUrl: "partials/index.html",
        controller: "MainCtrl",
        activetab: "home"
      }).
      when("/history", { 
        templateUrl: "partials/history.html",
        controller: "HisCtrl",
        activetab: "history"
      }).
      when("/hotspot", { 
        templateUrl: "partials/hotspot.html",
        controller: "HspCtrl",
        activetab: "hotspot"
      }).
      when("/userupload", { 
        templateUrl: "partials/userupload.html",
        controller: "UsrUpldCtrl",
        activetab: "userupload"
      }).
      when("/help", { 
        templateUrl: "partials/help.html",
        activetab: "help"
      }).
      when("/contact", { 
        templateUrl: "partials/contact.html",
        activetab: "contact"
      }).
      otherwise( { redirectTo: "/home", activetab: "home" });

      // use the HTML5Mode History API
      $locationProvider.html5Mode(true);
}).run(function ($rootScope, $route) {
    $rootScope.$route = $route;
});