import SocialNetwork from "../models/SocialNetwork.js";

const getSocialsLanding = async (req, res) => {
  const socials = await SocialNetwork.find()
    .where("user")
    .equals(process.env.ID_ADMIN)
    .select("name link icon");
  res.json(socials);
};

const getSocials = async (req, res) => {
  const socials = await SocialNetwork.find()
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
  res.json(socials);
};

const newSocial = async (req, res) => {
  const social = new SocialNetwork(req.body);
  social.user = req.user._id;
  try {
    const socialStore = await social.save();
    const socialResponse = await SocialNetwork.findById(
      socialStore._id
    ).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(socialResponse);
  } catch (error) {
    console.log(error);
  }
};

const getSocial = async (req, res) => {
  const { id } = req.params;
  const social = await SocialNetwork.findById(id);
  if (!social) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (social.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(social);
};

const editSocial = async (req, res) => {
  const { id } = req.params;
  const social = await SocialNetwork.findById(id);
  if (!social) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (social.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }

  social.name = req.body.name || social.name;
  social.link = req.body.link || social.link;
  social.icon = req.body.icon || social.icon;

  try {
    const socialStore = await social.save();
    const socialResponse = await SocialNetwork.findById(
      socialStore._id
    ).populate({
      path: "user",
      select: "userProfile",
      populate: {
        path: "userProfile",
        select: "imageURL",
      },
    });
    res.json(socialResponse);
  } catch (error) {
    console.log(error);
  }
};

const deleteSocial = async (req, res) => {
  const { id } = req.params;
  const social = await SocialNetwork.findById(id);
  if (!social) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (social.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  try {
    await social.deleteOne();
    res.json({ msg: "Social Network deleted" });
  } catch (error) {
    console.log(error);
  }
};

export {
  getSocials,
  newSocial,
  getSocial,
  editSocial,
  deleteSocial,
  getSocialsLanding,
};
