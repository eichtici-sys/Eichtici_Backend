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
    fileURL: {
      type: String,
      trim: true,
      required: true,
    },
    public_id: {
      type: String,
      trim: true,
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
