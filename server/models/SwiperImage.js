const mongoose = require("mongoose");

const swiperImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    // addedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Admin",
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SwiperImage", swiperImageSchema);
