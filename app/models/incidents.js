/**
 * Created by edward on 10/30/16.
 */
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
// Creates a Schema. This will be the basis of how user data is stored in the db
var TrafficIncidents = new Schema({
    location:{
        Lat: Number,
        Lng: Number
    },
    start: Number,
    end: Number,
    severity: Number,
    created_at: {type: Date, default: Date.now}
});

TrafficIncidents.pre('save', function(next){
    now = new Date();
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});
module.exports =  mongoose.model('Incidents', TrafficIncidents)