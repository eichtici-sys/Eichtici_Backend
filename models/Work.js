import mongoose from "mongoose";

const workSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    place: {
      type: String,
      trim: true,
      required: true,
    },
    startYear: {
      type: Number,
    },
    finishYear: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
  }
);

const Work = mongoose.model("Work", workSchema);

export default Work;
