const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema({
  name: {
    type: Schema.Types.String,
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "Cat"
  },
  image: {
    type: Schema.Types.String,
    required: true,
    default: "placeholder.png"
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Cat", categorySchema);
