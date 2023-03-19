import mongoose from "mongoose";

const serviceDescriptionSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  },
  {
    timestamps: true,
  }
);

const ServiceDescription = mongoose.model(
  "ServiceDescription",
  serviceDescriptionSchema
);

export default ServiceDescription;
