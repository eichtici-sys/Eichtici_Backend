import Skill from "../models/Skill.js";
import Level from "../models/Level.js";

const getSkills = async (req, res) => {
  const skills = await Skill.find().where("level").equals(req.level);
  res.json(skills);
};
const newSkill = async (req, res) => {
  const { level } = req.body;
  const existLevel = await Level.findById(level);

  if (!existLevel) {
    const error = new Error("Level does not exist");
    return res.status(404).json({ msg: error.message });
  }
  if (existLevel.user.toString() !== req.user._id.toString()) {
    const error = new Error("You don't have the permissions to add levels");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const skillStore = await Skill.create(req.body);
    existLevel.skills.push(skillStore._id);
    await existLevel.save();
    res.json(skillStore);
  } catch (error) {
    console.log(error);
  }
};

const getSkill = async (req, res) => {
  const { id } = req.params;
  const skill = await Skill.findById(id).populate("level");
  if (!skill) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (skill.level.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  res.json(skill);
};

const editSkill = async (req, res) => {
  const { id } = req.params;
  const skill = await Skill.findById(id).populate("level");
  if (!skill) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (skill.level.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  skill.name = req.body.name || skill.name;
  skill.scale = req.body.scale || skill.scale;

  try {
    const skillStore = await skill.save();
    res.json(skillStore);
  } catch (error) {
    console.log(error);
  }
};

const deleteSkill = async (req, res) => {
  const { id } = req.params;
  const skill = await Skill.findById(id).populate("level");
  if (!skill) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (skill.level.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const level = await Level.findById(skill.level);
    level.skills.pull(skill._id);

    await Promise.allSettled([await level.save(), await skill.deleteOne()]);

    res.json({ msg: "Skill deleted" });
  } catch (error) {
    console.log(error);
  }
};

export { newSkill, getSkill, editSkill, deleteSkill, getSkills };
