const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: {
    type: Schema.Types.String
  },
  password: {
    type: Schema.Types.String
  },
  phone: {
    type: Schema.Types.Number,
    required: true,
    unique: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  role: [
    {
      id: {
        type: Number,
        default: 0
      }
    }
  ],

  addresses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Address"
    }
  ],
  wallet: {
    type: Schema.Types.Number,
    default: 0
  },
  points: {
    type: Schema.Types.Number,
    default: 0
  },
  orders: Number
});
userSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};
module.exports = mongoose.model("user", userSchema);
