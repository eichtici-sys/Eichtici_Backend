import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    url: {
      type: String,
      trim: true,
      required: true,
    },
    imageURL: {
      type: String,
      trim: true,
      required: true,
    },
    public_id: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: ["To Begin", "In progress", "Completed"],
    },
    phase: {
      type: String,
      required: true,
      enum: [
        "Initiation",
        "Briefing",
        "Planning",
        "Design",
        "Development",
        "Testing",
        "Deployment",
        "Closed",
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: ["High", "Normal", "Low"],
    },
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    repository: {
      type: String,
      trim: true,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
