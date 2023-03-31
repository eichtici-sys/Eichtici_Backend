import cloudinary from "cloudinary";
import Profile from "../models/Profile.js";
import fs from "fs-extra";

const getContact = async (req, res) => {
  const profiles = await Profile.findOne()
    .where("user")
    .equals(process.env.ID_ADMIN)
    .select("name lastname phone email");
  res.json(profiles);
};

const getProfiles = async (req, res) => {
  const profiles = await Profile.findOne().where("user").equals(req.user);
  res.json(profiles);
};

const newProfile = async (req, res) => {};

const getProfile = async (req, res) => {
  const { id } = req.params;
  const profile = await Profile.findById(id);
  if (!profile) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (profile.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  res.json(profile);
};

const editProfile = async (req, res) => {
  const { id } = req.params;
  const profile = await Profile.findById(id);
  if (!profile) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }
  if (profile.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(401).json({ msg: error.message });
  }
  profile.name = req.body.name || profile.name;
  profile.lastname = req.body.lastname || profile.lastname;
  profile.birthday = req.body.birthday || profile.birthday;
  profile.gender = req.body.gender || profile.gender;
  profile.phone = req.body.phone || profile.phone;
  profile.email = req.body.email || profile.email;
  profile.address = req.body.address || profile.address;
  profile.numberAd = req.body.numberAd || profile.numberAd;
  profile.city = req.body.city || profile.city;

  if (profile.edit === false) {
    profile.edit = true;
    if (req.file !== undefined) {
      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );
      profile.imageURL = newImageUpload.url;
      profile.public_id = newImageUpload.public_id;
      try {
        const profileStore = await profile.save();
        await fs.unlink(req.file.path);
        res.json(profileStore);
      } catch (error) {
        console.log(error);
      }
    } else {      
      profile.imageURL = profile.imageURL;
      profile.public_id = profile.public_id;
      try {
        const profileStore = await profile.save();
        res.json(profileStore);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    if (req.file !== undefined) {
      const { result } = await cloudinary.v2.uploader.destroy(
        profile.public_id
      );

      const newImageUpload = await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "eichticiImages",
          use_filename: true,
        }
      );
      profile.imageURL = newImageUpload.url;
      profile.public_id = newImageUpload.public_id;
      try {
        const profileStore = await profile.save();
        await fs.unlink(req.file.path);
        res.json(profileStore);
      } catch (error) {
        console.log(error);
      }
    } else {
      profile.imageURL = profile.imageURL;
      profile.public_id = profile.public_id;
      try {
        const profileStore = await profile.save();
        res.json(profileStore);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

export { getProfiles, newProfile, getProfile, editProfile, getContact };
