import ServiceDescription from "../models/ServiceDescription.js";
import Service from "../models/Service.js";

const newDescription = async (req, res) => {
  const { service } = req.body;
  const existService = await Service.findById(service);

  if (!existService) {
    const error = new Error("Service does not exist");
    return res.status(404).json({ msg: error.message });
  }
  if (existService.user.toString() !== req.user._id.toString()) {
    const error = new Error("You don't have the permissions to add services");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const sDescriptionStore = await ServiceDescription.create(req.body);
    existService.servicesDescriptions.push(sDescriptionStore._id);
    await existService.save();
    res.json(sDescriptionStore);
  } catch (error) {
    console.log(error);
  }
};

const getDescription = async (req, res) => {
  const { id } = req.params;
  const sDescription = await ServiceDescription.findById(id).populate(
    "service"
  );
  if (!sDescription) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (sDescription.service.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  res.json(sDescription);
};

const editDescription = async (req, res) => {
  const { id } = req.params;
  const sDescription = await ServiceDescription.findById(id).populate(
    "service"
  );
  if (!sDescription) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (sDescription.service.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }

  sDescription.description = req.body.description || sDescription.description;

  try {
    const sDescriptionStore = await sDescription.save();
    res.json(sDescriptionStore);
  } catch (error) {
    console.log(error);
  }
};

const deleteDescription = async (req, res) => {
  const { id } = req.params;
  const sDescription = await ServiceDescription.findById(id).populate(
    "service"
  );
  if (!sDescription) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (sDescription.service.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const service = await Service.findById(sDescription.service);
    service.servicesDescriptions.pull(sDescription._id);

    await Promise.allSettled([
      await service.save(),
      await sDescription.deleteOne(),
    ]);

    res.json({ msg: "Description of Service deleted" });
  } catch (error) {
    console.log(error);
  }
};

export { newDescription, getDescription, editDescription, deleteDescription };
