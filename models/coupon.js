const mongoose = require("mongoose");

const { Schema } = mongoose;

const couponSchema = new Schema({
  product: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cat"
    }
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  min: Number,
  code: {
    type: String,
    required: true,
    index: true
  },
  discount: {
    type: Number,
    required: true
  },
  isPercent: Boolean,
  uses: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Coupon", couponSchema);
