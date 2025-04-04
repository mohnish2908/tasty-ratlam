const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    condition: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    description: {
      type: String,
    //   required: true,
    },
    // validFrom: {
    // type: Date,
    // required: true,
    // },
    // validTill: {
    // type: Date,
    // required: true,
    // },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
