const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status:{
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    description: {
      type: String,
      required: true,
    },
    heading:{
      type: String,
      required: true,
    },
    subHeading:[{
      type: String,
      required: true,
    }],
    pricePerWeight: [
      {
        weightInGrams: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    images: [
      {
        type: String,
        // required: true,
      },
    ],
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
