const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const orderStatus = require("../config/orderStatus");

const { Schema } = mongoose;
autoIncrement.initialize(mongoose);
const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  status: {
    type: Number,
    default: orderStatus.review
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "cartItem"
    }
  ],
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: "Address"
  },
  arriveAt: {
    from: Number,
    to: Number,
    day: String
  },
  totalCost: {
    type: Number,
    required: true
  },
  id: {
    type: Number
  },
  paymentMethod: {
    type: Number,
    enum: [1, 2]
  },
  isCoupon: Boolean,
  coupon: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  faka: String,
  instruction: String
});
orderSchema.plugin(autoIncrement.plugin, {
  model: "Order",
  field: "id",
  startAt: 192000,
  incrementBy: 1
});
module.exports = mongoose.model("Order", orderSchema);
