const mongoose = require("mongoose");
const { Schema } = mongoose;

const ArticleSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    likedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        liked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("article", ArticleSchema);
