var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AddressSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true
  },
  phone: {
    type: Schema.Types.String,
    required: true
  },
  city: {
    type: Schema.Types.String,
    required: true
  },
  area: {
    type: Schema.Types.String,
    required: true
  },
  street: {
    type: Schema.Types.String,
    required: true
  },
  building: {
    type: Schema.Types.String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

module.exports = mongoose.model("Address", AddressSchema);
