import Work from "../models/Work.js";

const getWorks = async (req, res) => {
  const works = await Work.find()
    .where("user")
    .equals(req.user)
    .populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
  res.json(works);
};

const newWork = async (req, res) => {
  const work = new Work(req.body);
  work.user = req.user._id;
  try {
    const workStore = await work.save();
    const workResponse = await Work.findById(workStore._id).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(workResponse);
  } catch (error) {
    console.log(error);
  }
};

const getWork = async (req, res) => {
  const { id } = req.params;
  const work = await Work.findById(id);
  if (!work) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (work.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(work);
};

const editWork = async (req, res) => {
  const { id } = req.params;
  const work = await Work.findById(id);
  if (!work) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (work.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  work.title = req.body.title || work.title;
  work.place = req.body.place || work.place;
  work.startYear = req.body.startYear || work.startYear;
  work.finishYear = req.body.finishYear || work.finishYear;

  try {
    const workStore = await work.save();
    const workResponse = await Work.findById(workStore._id).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    console.log(workResponse);
    res.json(workResponse);
  } catch (error) {
    console.log(error);
  }
};

const deleteWork = async (req, res) => {
  const { id } = req.params;
  const work = await Work.findById(id);
  if (!work) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (work.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await work.deleteOne();
    res.json({ msg: "Work deleted" });
  } catch (error) {
    console.log(error);
  }
};

export { getWorks, newWork, getWork, editWork, deleteWork };
