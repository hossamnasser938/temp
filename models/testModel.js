var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var testSchema = new Schema({
	'test' : String
});

module.exports = mongoose.model('test', testSchema);
