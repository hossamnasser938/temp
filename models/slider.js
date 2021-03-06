const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sliderSchema = new Schema({
  image: {
    type: Schema.Types.String,
    required: true
  },
  refType: {
    type: String,
    default: "category",
    required: true
  },
  refId: {}
});

module.exports = mongoose.model("Slider", sliderSchema);
