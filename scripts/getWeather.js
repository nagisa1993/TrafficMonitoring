/**
 * Created by edward on 11/1/16.
 */
var http = require("http");
var mongoose = require("mongoose");
var database = require("../data/database");
var Weathers = require("../app/models/weather");
mongoose.connect(database.url);
var weather,
    dict = {0: 0, 1: 61, 2: 30, 3: 61, 4: 61, 5: 0, 6: 61, 7: 30,
        8: 61, 9: 61, 10: 0, 11: 61, 12: 30, 13: 61, 14: 61, 15: 0,
        16: 61, 17: 30, 18: 61, 19: 61, 20: 0, 21: 61, 22: 30, 23: 61
    };
    dicthr = {0: 0, 1: 2, 2: 5, 3: 7, 4: 10, 5: 12, 6: 15, 7: 17, 8: 20, 9: 22};
function getWeather(){
    var time = new Date();
    var cur_hour = time.getHours(),
        cur_minute = time.getMinutes();
    // console.log("time: ", time.getHours(), " : ", time.getMinutes(), "weather: ", weather);
    if(weather === undefined || dict[cur_hour] <= cur_minute && cur_minute <= dict[cur_hour] + 2) {
        hour = cur_hour;
        minute = dict[cur_hour];
        var url = "http://api.openweathermap.org/data/2.5/group?id=5101717,5097598,5102922,5102578,5098124&units=metric&APPID=0cbf506d7c01ff59f3f92d8f97778e26";
        var req = http.get(url, function (res) {
            var buffer = "",
                data,
                cur_wea;
            res.on('data', function (chuck) {
                buffer += chuck;
            });
            res.on('end', function (err) {
                data = JSON.parse(buffer);
                var list = data.list;
                var cnt = data.cnt;
                for(var i = 0; i < cnt; i++){
                    var newweather = new Weathers({
                        "name" : list[i].name,
                        "weather" : list[i].weather[0].main,
                        "Time" : roundTime(cur_hour,cur_minute),
                        "location" :{
                            "lat": list[i].coord.lat,
                            "lng": list[i].coord.lon
                        },
                        "description": list[i].weather[0].description
                    });
                    newweather.save(function(err){
                        if(err){
                            return;
                        }
                    });
                }
                cur_wea = data.list[0].weather[0].main;
                weather = cur_wea;
            });
        });
        req.end();
    }else {
        console.log("skip: " , weather);
    }
    return weather;
};
function roundTime(hr, min){
    var i = Math.floor((hr + min/60)/2.5);
    return dicthr[i] + ":" + dict[dicthr[i]];
}
function run(){
    weather = getWeather();
    setTimeout(run, 10000000);
}
run();