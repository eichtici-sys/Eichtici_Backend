import mongoose from "mongoose";

const cvSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    originalName: {
      type: String,
      trim: true,
      required: true,
    },
    fileName: {
      type: String,
      trim: true,
      required: true,
    },
    pathFile: {
      type: String,
      trim: true,
      required: true,
    },
    dataPreview: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Curriculum = mongoose.model("Curriculum", cvSchema);

export default Curriculum;
