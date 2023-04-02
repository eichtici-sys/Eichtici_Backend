import User from "../models/User.js";
import Profile from "../models/Profile.js";
import About from "../models/About.js";
import generateId from "../helpers/generateId.js";
import generateJwt from "../helpers/generateJwt.js";
import { emailRegister, emailResetPswd } from "../helpers/email.js";
import { initialProfile, initialAbout } from "../data/initialData.js";

const register = async (req, res) => {
  //Avoid duplicate records
  const { email } = req.body;
  const existUser = await User.findOne({ email });

  if (existUser) {
    const error = new Error("User already exists");
    return res.status(400).json({ msg: error.message });
  }

  // Store User in DB
  try {
    const user = new User(req.body);
    user.token = generateId();

    const storedUser1 = await user.save();

    const profile = new Profile();
    profile.user = user._id;
    profile.name = initialProfile.name;
    profile.lastname = initialProfile.lastname;
    profile.gender = initialProfile.gender;
    profile.phone = initialProfile.phone;
    profile.email = user.email;
    profile.address = initialProfile.address;
    profile.numberAd = initialProfile.numberAd;
    profile.city = initialProfile.city;
    profile.imageURL = initialProfile.imageURL;
    profile.public_id = initialProfile.public_id;

    const profileStore = await profile.save();

    const about = new About();
    about.user = user._id;
    about.presentation = initialAbout.presentation;
    about.description = initialAbout.description;
    about.resumen = initialAbout.resumen;
    about.imagePresentationURL = initialAbout.imagePresentationURL;
    about.imagePresentation_publicId = initialAbout.imagePresentation_publicId;
    about.imageAboutURL = initialAbout.imageAboutURL;
    about.imageAbout_publicId = initialAbout.imageAbout_publicId;
    about.imageResumenURL = initialAbout.imageResumenURL;
    about.imgResumen_publicid = initialAbout.imgResumen_publicid;
    about.imageBG_URL = initialAbout.imageBG_URL;
    about.imgBG_publicid = initialAbout.imgBG_publicid;

    const aboutStore = await about.save();

    user.userProfile = profile._id;
    const userFinal = await user.save();

    //Send Email
    emailRegister({
      email: user.email,
      name: user.username,
      token: user.token,
    });

    res.json({
      msg: "User created successfully, check your email to confirm your account",
      profile: profileStore,
      about: aboutStore,
    });
  } catch (error) {
    console.log(error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  //Exists user ?

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }
  //Confirm user ?
  if (!user.confirm) {
    const error = new Error("Your account has not been confirmed");
    return res.status(403).json({ msg: error.message });
  }
  //Verify Password
  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateJwt(user._id),
    });
  } else {
    const error = new Error("Incorrect password");
    return res.status(403).json({ msg: error.message });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });
  if (!userConfirm) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }

  try {
    userConfirm.confirm = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.json({ msg: "User confirmed successfully" });
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();
    //Send Email
    emailResetPswd({
      email: user.email,
      name: user.username,
      token: user.token,
    });
    res.json({ msg: "We have sent an email with the instructions" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;
  const validToken = await User.findOne({ token });
  if (validToken) {
    res.json("Valid Token");
  } else {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = "";
    try {
      await user.save();
      res.json({ msg: "Password changed successfully" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Invalid Token");
    return res.status(404).json({ msg: error.message });
  }
};

const adminProfile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

export {
  register,
  authenticate,
  confirm,
  resetPassword,
  checkToken,
  newPassword,
  adminProfile,
};
