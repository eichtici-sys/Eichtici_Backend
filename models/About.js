import mongoose from "mongoose";

const aboutSchema = mongoose.Schema(
  {
    presentation: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    resumen: {
      type: String,
      required: true,
      trim: true,
    },
    imagePresentationURL: {
      type: String,
      trim: true,
      required: true,
    },
    imagePresentation_publicId: {
      type: String,
      trim: true,
      required: true,
    },
    edit_Img_Pres: {
      type: Boolean,
      default: false,
    },
    imageAboutURL: {
      type: String,
      trim: true,
      required: true,
    },
    imageAbout_publicId: {
      type: String,
      trim: true,
      required: true,
    },
    edit_Img_About: {
      type: Boolean,
      default: false,
    },
    imageResumenURL: {
      type: String,
      trim: true,
      required: true,
    },
    imgResumen_publicid: {
      type: String,
      trim: true,
      required: true,
    },
    edit_Img_Resumen: {
      type: Boolean,
      default: false,
    },
    imageBG_URL: {
      type: String,
      trim: true,
      required: true,
    },
    imgBG_publicid: {
      type: String,
      trim: true,
      required: true,
    },
    edit_Img_BG: {
      type: Boolean,
      default: false,
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

const About = mongoose.model("About", aboutSchema);

export default About;
