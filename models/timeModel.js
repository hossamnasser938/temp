var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var timeSchema = new Schema({
	'from' : Number,
	'to' : Number
});

module.exports = mongoose.model('time', timeSchema);
