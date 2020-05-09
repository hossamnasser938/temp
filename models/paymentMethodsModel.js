var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var paymentMethodsSchema = new Schema({
  nameAr: String,
  nameEn: String,
  type: Number
});

module.exports = mongoose.model("paymentMethods", paymentMethodsSchema);
