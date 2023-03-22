import Technology from "../models/Technology.js";
import Project from "../models/Project.js";

const getTecnologies = async (req, res) => {
  const technologies = await Technology.find()
    .where("project")
    .equals(req.project)
    .populate({
      path: "project",
      select: "name",
    });
  res.json(technologies);
};
const newTechnology = async (req, res) => {
  const { project } = req.body;
  const existProject = await Project.findById(project);
  console.log(existProject);

  if (!existProject) {
    const error = new Error("Project does not exist");
    return res.status(404).json({ msg: error.message });
  }
  if (existProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "You don't have the permissions to add technologies"
    );
    return res.status(403).json({ msg: error.message });
  }
  try {
    const technologyStore = await Technology.create(req.body);
    existProject.technologies.push(technologyStore._id);
    await existProject.save();
    res.json(technologyStore);
  } catch (error) {
    console.log(error);
  }
};

const getTechnology = async (req, res) => {
  const { id } = req.params;
  const technology = await Technology.findById(id).populate("project");
  if (!technology) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (technology.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  res.json(technology);
};

const editTechnology = async (req, res) => {
  const { id } = req.params;
  const technology = await Technology.findById(id).populate("project");
  if (!technology) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (technology.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  technology.name = req.body.name || technology.name;

  try {
    const technologyStore = await technology.save();
    res.json(technologyStore);
  } catch (error) {
    console.log(error);
  }
};

const deleteTechnology = async (req, res) => {
  const { id } = req.params;
  const technology = await Technology.findById(id).populate("project");
  if (!technology) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (technology.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const project = await Project.findById(technology.project);
    project.technologies.pull(technology._id);

    await Promise.allSettled([
      await project.save(),
      await technology.deleteOne(),
    ]);

    res.json({ msg: "Technology deleted" });
  } catch (error) {
    console.log(error);
  }
};

export {
  newTechnology,
  getTechnology,
  editTechnology,
  deleteTechnology,
  getTecnologies,
};
