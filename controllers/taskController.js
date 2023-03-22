import Task from "../models/Task.js";
import Project from "../models/Project.js";

const getTasks = async (req, res) => {
  const tasks = await Task.find()
    .where("project")
    .equals(req.project)
    .populate({
      path: "project",
      select: "name",
    });
  res.json(tasks);
};
const newTask = async (req, res) => {
  const { project } = req.body;
  const existProject = await Project.findById(project);

  if (!existProject) {
    const error = new Error("Project does not exist");
    return res.status(404).json({ msg: error.message });
  }
  if (existProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You don't have the permissions to add tasks");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const taskStore = await Task.create(req.body);
    existProject.tasks.push(taskStore._id);
    await existProject.save();
    res.json(taskStore);
  } catch (error) {
    console.log(error);
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  res.json(task);
};

const editTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  task.name = req.body.name || task.name;
  task.description = req.body.description || task.description;

  try {
    const taskStore = await task.save();
    res.json(taskStore);
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const project = await Project.findById(task.project);
    project.tasks.pull(task._id);

    await Promise.allSettled([await project.save(), await task.deleteOne()]);

    res.json({ msg: "Task deleted" });
  } catch (error) {
    console.log(error);
  }
};

const changeState = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  task.state = !task.state;

  const taskStore = await task.save();
  res.json(taskStore);
};

export { newTask, getTask, editTask, deleteTask, getTasks, changeState };
