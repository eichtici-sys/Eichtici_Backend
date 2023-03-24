import cloudinary from "cloudinary";
import Curriculum from "../models/Curriculum.js";
import fs from "fs-extra";

const getCvs = async (req, res) => {
  const cvs = await Curriculum.find()
    .where("user")
    .equals(req.user)
    .select("-pathFile")
    .populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
  res.json(cvs);
};

const newCv = async (req, res) => {

  const cv = new Curriculum(req.body);
  cv.originalName = req.file.originalname;
  cv.fileName = req.file.filename;
  cv.pathFile = req.file.path;
  cv.user = req.user._id;

  try {
    const cvStore = await cv.save();
    const cvResponse = await Curriculum.findById(cvStore._id)
      .select("-pahtFile")
      .populate({
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
  await fs.unlink(cv.pathFile);
  try {
    await cv.deleteOne();
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
  const cvResponse = await Curriculum.findById(cvStore._id)
    .select("-pathFile")
    .populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
  res.json(cvResponse);
};

const downloadCv = async (req, res) => {
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
  try {
    const urlDownload = `public/uploads/${cv.fileName}`;
    res.download(urlDownload, function (err) {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export { getCvs, newCv, deleteCv, changeStateCv, downloadCv };
