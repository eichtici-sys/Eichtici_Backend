import cloudinary from "cloudinary";
import Curriculum from "../models/Curriculum.js";
import fs from "fs-extra";

const getCvs = async (req, res) => {
  const cvs = await Curriculum.find().where("user").equals(req.user);
  res.json(cvs);
};

const newCv = async (req, res) => {
  const resultUpload = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: "eichticiPdfs",
    use_filename: true,
  });
  const cv = new Curriculum(req.body);
  cv.fileURL = resultUpload.url;
  cv.public_id = resultUpload.public_id;
  cv.user = req.user._id;

  try {
    const cvStore = await cv.save();
    await fs.unlink(req.file.path);
    const cvResponse = await Curriculum.findById(cvStore._id).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(cvResponse);
  } catch (error) {
    console.log(error);
  }
};

const deleteCv = async (req, res) => {
  const { id } = req.params;
  const cv = await Curriculum.findById(id);
  if (!cv) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (cv.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }

  try {
    const { result } = await cloudinary.v2.uploader.destroy(cv.public_id);
    if (result === "not found") {
      const error = new Error("Please provide correct public_id");
      return res.status(401).json({ msg: error.message });
    }
    if (result == "ok") {
      await cv.deleteOne();
    } else {
      const error = new Error("Try again later");
      return res.status(401).json({ msg: error.message });
    }
    res.json({ msg: "File deleted" });
  } catch (error) {
    console.log(error);
  }
};

const changeStateCv = async (req, res) => {
  const { id } = req.params;
  const cv = await Curriculum.findById(id);
  if (!cv) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (cv.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  cv.visible = !cv.visible;

  const cvStore = await cv.save();
  res.json(cvStore);
};

const downloadCv = async (req, res) => {};

export { getCvs, newCv, deleteCv, changeStateCv, downloadCv };
