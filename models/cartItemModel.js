const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  replacement: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  count: {
    type: Schema.Types.Number,
    required: true
  },
  cost: {
    type: Schema.Types.Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  inCart: {
    type: Schema.Types.Boolean,
    default: true
  },
  created_at: {
    type: Schema.Types.Date,
    default: Date.now
  }
});

module.exports = mongoose.model("cartItem", cartItemSchema);
