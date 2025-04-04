const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    title:{
      type: String,
      required:true,
    },
    review: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "Product",
      index: true,
    },
    comboProduct: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: "ComboProduct",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
