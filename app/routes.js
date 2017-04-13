/**
 * Created by mahaiyue on 10/16/16.
 */
// Load the model
var History = require('./models/model');
var Incidents = require('./models/incidents');
var Weathers = require('./models/weather');
var Reports = require('./models/report');

// Opens App routes RESTful design
module.exports = function(app) {

    // api ---------------------------------------------------------------------
    /**************************************************************************/
    /**                               History                                **/
    /**************************************************************************/
    // get all histories
    app.get('/api/historys', function(req, res) {

        // use mongoose to get all histories in the database
        History.find(function(err, historys) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(historys); // return all histories in JSON format
        });
    });

// create history and send back all histories after creation
    app.post('/api/historys', function(req, res) {

        // create a history
        var newhistory = new History(req.body);
        newhistory.save(function(err){
            if(err)
                res.send(err);

            res.json(req.body);
        });

    });

// delete a history
    app.delete('/api/historys/:history_id', function(req, res) {
        History.remove({
            _id : req.params.history_id
        }, function(err, history) {
            if (err)
                res.send(err);

            // get and return all the histories after you create another
            History.find(function(err, historys) {
                if (err)
                    res.send(err);

                res.json(historys);
            });
        });
    });

    /**************************************************************************/
    /**                              Incident                                **/
    /**************************************************************************/
    // get all incidents
    app.get('/api/incidents', function(req, res) {
        // use mongoose to get all incidents in the database
        Incidents.find(function(err, incidents) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);
            var results = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

            var incidentobj = function(){
              this.getobjhour = function(){
                return this.getHours();
              };
              return this;
            };

            for(var i = 0; i < incidents.length; i++){
              // to calculate all incidents according to hours, we take created_at param
              var obj = incidentobj.apply(incidents[i].created_at);
              var num = parseInt(obj.getobjhour());
              results[num]++;
            }

            res.send(results);
            res.end();
        });
    });

    // get all incidents for one route
    app.post('/api/incidents', function(req, res) {
        console.log(req.body.roadName);
        // use mongoose to get all incidents in the database
        Incidents.find({}, function(err, incidents) {
            var inci = incidents.filter(function(obj){
                if(req.body.roadName.includes(obj.roadName)){
                    return obj;
                }
            });
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            var results = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

            var incidentobj = function(){
              this.getobjhour = function(){
                return this.getHours();
              };
              return this;
            };

            for(var i = 0; i < inci.length; i++){
              // to calculate all incidents according to hours, we take created_at param
              var obj = incidentobj.apply(inci[i].created_at);
              var num = parseInt(obj.getobjhour());
              results[num]++;
            }

            
                res.send(results);
                res.end();
  
        });
    });

    /**************************************************************************/
    /**                              Reports                                 **/
    /**************************************************************************/
    app.get('/api/reports', function(req, res) {
        Reports.find(function(err, reports) {
            if (err)
                res.send(err);

            res.json(reports);
        });
    });

    app.post('/api/reports', function(req, res) {

        var newreport = new Reports(req.body);
        newreport.save(function(err){
            if(err)
                res.send(err);

            res.json(req.body);
        });
    });
    
    // delete a report
    app.delete('/api/reports/:report_id', function(req, res) {
        Reports.remove({
            _id : req.params.report_id
        }, function(err, reports) {
            if (err)
                res.send(err);

            // get and return all the histories after you create another
            Reports.find(function(err, reports) {
                if (err)
                    res.send(err);

                res.json(reports);
            });
        });
    });
    /**************************************************************************/
    /**                               Weather                                **/
    /**************************************************************************/
    // get all weathers
    app.get('/api/weathers', function(req, res) {
        // use mongoose to get all weathers in the database
        Weathers.find(function(err, weathers) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);
            res.json(weathers); // return all incidents in JSON format
        });
    });

    // create weather object and send back all weather after creation
    app.post('/api/weathers', function(req, res) {
        // create a incidents
        var newweather = new Weathers(req.body);
        newweather.save(function(err){
            if(err)
                res.send(err);

            res.json(req.body);
        });
    });

    /**************************************************************************/
    /**                               Hotspot                                **/
    /**************************************************************************/
    // get all locations according to weathers
    app.post('/api/hotspots', function(req, res) {

        // all weathers, so there's nothing to do with weather
        if(req.body.weather == 'All'){
            var results = [];
            // weekend
            if(req.body.day == "Weekend"){
                Incidents.find({}, function(err, incidents){
                    if(err)
                        res.send(err);
                    else{
                        var temp = incidents.filter(function(obj){
                            if(this == "Critical")
                                return (obj.severity == 4 && (new Date(Date.parse(obj.created_at))).getUTCDay() == 0) || (obj.severity == 4 && (new Date(Date.parse(obj.created_at))).getUTCDay() == 6);
                            else
                                return (new Date(Date.parse(obj.created_at))).getUTCDay() == 0 || (new Date(Date.parse(obj.created_at))).getUTCDay() == 6;
                        }, req.body.severity);
                        for(var j = 0; j < temp.length; j++){
                            results.push(temp[j]);
                        }
                    }
                });
            }

            // weekday
            else if(req.body.day == "Weekday"){
                Incidents.find({}, function(err, incidents){
                    if(err)
                        res.send(err);
                    else{
                        var temp = incidents.filter(function(obj){
                            if(this == "Critical")
                                return (obj.severity == 4 && (new Date(Date.parse(obj.created_at))).getUTCDay() != 0) && (obj.severity == 4 && (new Date(Date.parse(obj.created_at))).getUTCDay() != 6);
                            else
                                return (new Date(Date.parse(obj.created_at))).getUTCDay() != 0 && (new Date(Date.parse(obj.created_at))).getUTCDay() != 6;
                        }, req.body.severity);
                        for(var j = 0; j < temp.length; j++){
                            results.push(temp[j]);
                        }
                    }
                });
            }

            // all
            else{
                Incidents.find({}, function(err, incidents){
                    if(err)
                        res.send(err);
                    else{
                        var temp = incidents.filter(function(obj){
                            if(this == "Critical")
                                return obj.severity == 4;
                            else
                                return obj;
                        }, req.body.severity);
                        for(var j = 0; j < temp.length; j++){
                            results.push(temp[j]);
                        }
                    }
                });
            }

            // because HTTP is async, we should wait until results' finished
            setTimeout(function(){
                res.json(results);
                results = [];
            }, 100);
        }

        // specific weather
        else{
            Weathers.find({
                weather: req.body.weather,
                name: "New Brunswick"
            }, function(err, weathers){
                if(err)
                    res.send(err);

                // weathers are already JSON format[{},{}], so we should pull each weather object out
                var results = [];
                for(var i = 0; i < weathers.length; i++){
                    var weatherday = (new Date(Date.parse(weathers[i].Date))).getUTCDay();

                    // weekend and same date
                    if((weatherday == 0 && req.body.day ==  "Weekend") || (weatherday == 6 && req.body.day ==  "Weekend")){
                        Incidents.find({
                            startTime: {$lte: weathers[i].Date},
                            endTime: {$gte: weathers[i].Date}
                        }, function(err, incidents){
                            if(err)
                                res.send(err);
                            // return json format incidents with requested severity
                            else{
                                var temp = incidents.filter(function(obj){
                                    if(this == 'Critical')
                                        return obj.severity == 4;
                                    else
                                        return obj;
                                }, req.body.severity);
                                for(var j = 0; j < temp.length; j++){
                                    results.push(temp[j]);
                                }
                            }
                        });
                    }

                    // weekday and same date
                    else if((weatherday != 0 && req.body.day ==  "Weekday") && (weatherday != 6 && req.body.day ==  "Weekday")){
                        Incidents.find({
                            startTime: {$lte: weathers[i].Date},
                            endTime: {$gte: weathers[i].Date}
                        }, function(err, incidents){
                            if(err)
                                res.send(err);
                            // return json format incidents with requested severity
                            else {
                                var temp = incidents.filter(function(obj){
                                    if(this == 'Critical')
                                        return obj.severity == 4;
                                    else
                                        return obj;
                                }, req.body.severity);
                                for(var j = 0; j < temp.length; j++){
                                    results.push(temp[j]);
                                }
                            }
                        });
                    }

                    // all
                    else if(req.body.day == "All"){
                        Incidents.find({
                            startTime: {$lte: weathers[i].Date},
                            endTime: {$gte: weathers[i].Date}
                        }, function(err, incidents){
                            if(err)
                                res.send(err);
                            // return json format incidents with requested severity
                            else {
                                var temp = incidents.filter(function(obj){
                                    if(this == 'Critical')
                                        return obj.severity == 4;
                                    else
                                        return obj;
                                }, req.body.severity);
                                for(var j = 0; j < temp.length; j++){
                                    results.push(temp[j]);
                                }
                            }
                        });
                    }

                    // no result matches
                    else
                        results = [];             
                }

                // because HTTP is async, we should wait until results' finished
                setTimeout(function(){
                    res.json(results);
                    results = [];
                }, 100);
                
            });
        } 
                              
    });

    /**************************************************************************/
    /**             Delay and num of incidents prediction                    **/
    /**************************************************************************/
    // get prediction json
    app.get('/api/prediction', function(req, res) {
        // console.log("hello");
        var spawn = require('child_process').spawn,
            py    = spawn('python', ['./scripts/mlp.py']),
            datastring = "",
            roadname = decodeURI(req.query.roadname),
            time = req.query.time,
            severity = req.query.severity,
            tuple = [roadname, time, severity];
        console.log(tuple);
        py.stdout.on('data', function (data) {
            // console.log(data);
            // console.log("successful");
            console.log("before data write");
            datastring += data.toString();
        });
        py.stdout.on('end', function (data) {
            console.log("done");
            console.log(datastring);
            res.send(datastring);
        });
        py.stdin.write(JSON.stringify(tuple));
        py.stdin.end();
    });

};

