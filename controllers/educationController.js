import Education from "../models/Education.js";

const getEducations = async (req, res) => {
  const educations = await Education.find()
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
  res.json(educations);
};

const newEducation = async (req, res) => {
  const education = new Education(req.body);
  education.user = req.user._id;
  try {
    const educationStore = await education.save();
    const educationResponse = await Education.findById(
      educationStore._id
    ).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(educationResponse);
  } catch (error) {
    console.log(error);
  }
};

const getEducation = async (req, res) => {
  const { id } = req.params;
  const education = await Education.findById(id);
  //Exist?
  if (!education) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  //Is user Education?
  if (education.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(education);
};

const editEducation = async (req, res) => {
  const { id } = req.params;
  const education = await Education.findById(id);
  if (!education) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (education.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }

  education.title = req.body.title || education.title;
  education.place = req.body.place || education.place;
  education.startYear = req.body.startYear || education.startYear;
  education.finishYear = req.body.finishYear || education.finishYear;

  try {
    const educationStore = await education.save();
    const educationResponse = await Education.findById(
      educationStore._id
    ).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(educationResponse);
  } catch (error) {
    console.log(error);
  }
};

const deleteEducation = async (req, res) => {
  const { id } = req.params;
  const education = await Education.findById(id);
  //Exist?
  if (!education) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  //Is user Education?
  if (education.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  try {
    await education.deleteOne();
    res.json({ msg: "Education deleted" });
  } catch (error) {
    console.log(error);
  }
};

export {
  getEducations,
  newEducation,
  getEducation,
  editEducation,
  deleteEducation,
};
