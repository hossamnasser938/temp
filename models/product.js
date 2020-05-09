const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = Schema({
  title: {
    type: Schema.Types.String,
    required: true
  },
  details: {
    type: Schema.Types.String,
    required: true
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cat"
    }
  ],
  price: {
    type: Schema.Types.Number,
    required: true
  },
  discount: {
    type: Schema.Types.Number
  },
  discountEnds: {
    type: Schema.Types.Date
  },
  barCode: {
    type: String,
    unique: true
  },
  increaseCount: {
    type: Schema.Types.Number,
    default: 1
  },
  images: [
    {
      type: Schema.Types.String
    }
  ],
  created_at: {
    type: Schema.Types.Date,
    default: Date.now
  },
  sold: {
    type: Schema.Types.Number,
    default: 0
  },
  userMax: {
    type: Schema.Types.Number
  },
  inStock: {
    type: Schema.Types.Number
  }
});
productSchema.index({
  "$**": "text"
});

module.exports = mongoose.model("Product", productSchema);
