import mongoose from "mongoose";

const technologySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

const Technology = mongoose.model("Technology", technologySchema);

export default Technology;
