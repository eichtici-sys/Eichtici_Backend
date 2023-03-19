import Service from "../models/Service.js";

const getServices = async (req, res) => {
  const services = await Service.find()
    .where("user")
    .equals(req.user)
    .select("-servicesDescriptions")
    .populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
  res.json(services);
};

const newService = async (req, res) => {
  const service = new Service(req.body);
  service.user = req.user._id;
  try {
    const serviceStore = await service.save();
    const serviceResponse = await Service.findById(serviceStore._id).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(serviceResponse);
  } catch (error) {
    console.log(error);
  }
};

const getService = async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id)
    .populate("servicesDescriptions", "description createdAt updatedAt")
    .populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "name",
      },
    });

  if (!service) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (service.user._id.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(service);
};

const editService = async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);
  if (!service) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (service.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }

  service.name = req.body.name || service.name;
  service.icon = req.body.icon || service.icon;
  service.description = req.body.description || service.description;

  try {
    const serviceStore = await service.save();
    const serviceResponse = await Service.findById(serviceStore._id).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(serviceResponse);
  } catch (error) {
    console.log(error);
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  const service = await Service.findById(id);
  if (!service) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (service.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  try {
    await service.deleteOne();
    res.json({ msg: "Service deleted" });
  } catch (error) {
    console.log(error);
  }
};

export { getServices, newService, getService, editService, deleteService };
