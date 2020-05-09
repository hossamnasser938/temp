const mongoose = require("mongoose");

const { Schema } = mongoose;

const constantSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true }
});

module.exports = mongoose.model("constant", constantSchema);
