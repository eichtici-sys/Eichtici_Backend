import mongoose from "mongoose";

const educationSchema = mongoose.Schema(
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

const Education = mongoose.model("Education", educationSchema);

export default Education;
