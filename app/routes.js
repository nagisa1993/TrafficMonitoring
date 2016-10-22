/**
 * Created by mahaiyue on 10/16/16.
 */
// Load the model
var History = require('./models/model');

// Opens App routes RESTful design
module.exports = function(app) {

    // api ---------------------------------------------------------------------

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
};