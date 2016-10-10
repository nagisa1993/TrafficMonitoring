$(document).ready(function(){
    $(".side-bar").mouseleave(function(){
         $(".wrapper").addClass("active");
    });
    $(".side-bar").mouseenter(function(){
         $(".wrapper").removeClass("active");
    });
});