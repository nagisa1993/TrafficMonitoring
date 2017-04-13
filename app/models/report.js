/**
** Created by mahaiyue on 11/21/16
**/

// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Schema. This will be the basis of how user data is stored in the db
var Report = new Schema({
    location:String,
    time: Number,
    category: String
});

module.exports = mongoose.model('Reports', Report);
