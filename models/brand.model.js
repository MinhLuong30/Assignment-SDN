const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
    },
    perfumes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Perfumes",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brands", brandSchema);
