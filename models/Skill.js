import mongoose from "mongoose";

const skillSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    scale: {
      type: String,
      required: true,
      enum: ["Basic", "Intermediate", "Advanced"],
    },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
