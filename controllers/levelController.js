import Level from "../models/Level.js";

const getAllLevels = async (req, res) => {
  const levels = await Level.find()
    .where("user")
    .equals(process.env.ID_ADMIN)
    .select("-user -createdAt -updatedAt -__v")
    .populate({
      path: "skills",
      select: "_id name scale",
    });

  res.json(levels);
  return;
};
const getLevels = async (req, res) => {
  const levels = await Level.find()
    .where("user")
    .equals(req.user)
    .select("-skills")
    .populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
  res.json(levels);
};

const getTotalSkills = async (req, res) => {
  const levels = await Level.find()
    .where("user")
    .equals(req.user)
    .select("skills");
  res.json(levels);
};

const newLevel = async (req, res) => {
  const level = new Level(req.body);
  level.user = req.user._id;
  try {
    const levelStore = await level.save();
    const levelResponse = await Level.findById(levelStore._id).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(levelResponse);
  } catch (error) {
    console.log(error);
  }
};

const getLevel = async (req, res) => {
  const { id } = req.params;

  const level = await Level.findById(id)
    .populate("skills", "name scale createdAt updatedAt")
    .populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "name",
      },
    });

  if (!level) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (level.user._id.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(level);
};

const editLevel = async (req, res) => {
  const { id } = req.params;
  const level = await Level.findById(id);
  if (!level) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (level.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }

  level.title = req.body.title || level.title;
  level.description = req.body.description || level.description;
  level.icon = req.body.icon || level.icon;

  try {
    const levelStore = await level.save();
    const levelResponse = await Level.findById(levelStore._id).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(levelResponse);
  } catch (error) {
    console.log(error);
  }
};

const deleteLevel = async (req, res) => {
  const { id } = req.params;
  const level = await Level.findById(id);
  if (!level) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (level.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  try {
    await level.deleteOne();
    res.json({ msg: "Level deleted" });
  } catch (error) {
    console.log(error);
  }
};

export {
  getLevels,
  newLevel,
  getLevel,
  editLevel,
  deleteLevel,
  getTotalSkills,
  getAllLevels,
};
