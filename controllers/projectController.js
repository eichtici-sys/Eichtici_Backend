import cloudinary from "cloudinary";
import Project from "../models/Project.js";
import fs from "fs-extra";

const getAllProjects = async (req, res) => {
  const projects = await Project.find()
    .where("creator")
    .equals(process.env.ID_ADMIN)
    .select("-creator -createdAt -updatedAt -__v -tasks -phase -priority")
    .populate({
      path: "technologies",
      select: "_id name",
    });
  const completed = projects.filter((project) => project.state === "Completed");

  res.json(completed);
  return;
};

const getProjects = async (req, res) => {
  const projects = await Project.find()
    .where("creator")
    .equals(req.user)
    .populate({
      path: "creator",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
  res.json(projects);
};

const newProject = async (req, res) => {
  const resultUpload = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: "eichticiImages",
    use_filename: true,
  });
  const project = new Project(req.body);
  project.imageURL = resultUpload.url;
  project.public_id = resultUpload.public_id;
  project.creator = req.user._id;

  try {
    const projectStore = await project.save();
    await fs.unlink(req.file.path);
    const projectResponse = await Project.findById(projectStore._id).populate({
      path: "creator",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(projectResponse);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id)
    .populate({
      path: "creator",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "name",
      },
    })
    .populate({
      path: "technologies",
      select: "-__v",
      populate: {
        path: "project",
        select: "name",
      },
    })
    .populate({
      path: "tasks",
      select: "-__v",
    });
  if (!project) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator._id.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(project);
};

const editProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.url = req.body.url || project.url;
  project.repository = req.body.repository || project.repository;
  project.state = req.body.state || project.state;
  project.phase = req.body.phase || project.phase;
  project.priority = req.body.priority || project.priority;
  project.featured = req.body.featured || project.featured;
  if (req.file !== undefined) {
    const { result } = await cloudinary.v2.uploader.destroy(project.public_id);

    const newImageUpload = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "eichticiImages",
      use_filename: true,
    });
    project.imageURL = newImageUpload.url;
    project.public_id = newImageUpload.public_id;

    try {
      const projectStore = await project.save();
      await fs.unlink(req.file.path);
      const projectResponse = await Project.findById(projectStore._id).populate(
        {
          path: "creator",
          select: "userProfile",
          populate: {
            path: "userProfile",
            select: "imageURL",
          },
        }
      );
      res.json(projectResponse);
    } catch (error) {
      console.log(error);
    }
  } else {
    project.imageURL = project.imageURL;
    project.public_id = project.public_id;
    try {
      const projectStore = await project.save();
      const projectResponse = await Project.findById(projectStore._id).populate(
        {
          path: "creator",
          select: "userProfile",
          populate: {
            path: "userProfile",
            select: "imageURL",
          },
        }
      );
      res.json(projectResponse);
    } catch (error) {
      console.log(error);
    }
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }

  try {
    const { result } = await cloudinary.v2.uploader.destroy(project.public_id);
    if (result === "not found") {
      const error = new Error("Please provide correct public_id");
      return res.status(401).json({ msg: error.message });
    }
    if (result == "ok") {
      await project.deleteOne();
    } else {
      const error = new Error("Try again later");
      return res.status(401).json({ msg: error.message });
    }
    res.json({ msg: "Project deleted" });
  } catch (error) {
    console.log(error);
  }
};

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  getAllProjects,
};
