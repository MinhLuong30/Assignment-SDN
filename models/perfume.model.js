const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      required: true,
    },
  },
  { timestamps: true }
);

const perfumeSchema = new mongoose.Schema(
  {
    perfumeName: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      required: true,
    },
    concentration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    targetAudience: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Perfumes", perfumeSchema);
