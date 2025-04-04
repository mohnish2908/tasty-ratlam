const mongoose = require("mongoose");

const comboProductSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
    weightInGrams: {
          type: Number,
          required: true,
    },
    heading: {
      type: String,
    },
    subHeading: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
        // required: true,
      },
    ],
    products: [
      {
        type:String,
        required: true,
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

module.exports = mongoose.model("ComboProduct", comboProductSchema);
