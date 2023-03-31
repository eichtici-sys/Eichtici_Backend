import User from "../models/User.js";
import Profile from "../models/Profile.js";
import About from "../models/About.js";
import generateId from "../helpers/generateId.js";
import generateJwt from "../helpers/generateJwt.js";
import { emailRegister, emailResetPswd } from "../helpers/email.js";

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
    profile.name = "Test";
    profile.lastname = "Test";
    profile.gender = "Male";
    profile.phone = "999999999";
    profile.email = user.email;
    profile.address = "Av. de Ejemplo";
    profile.numberAd = 1350;
    profile.city = "Your City";
    profile.imageURL =
      "https://res.cloudinary.com/dgdyzgrmi/image/upload/v1680214048/eichticiImages/icon-128x128_uswyjm.png";
    profile.public_id = "eichticiImages/icon-128x128_uswyjm";

    const profileStore = await profile.save();

    const about = new About();
    about.user = user._id;
    about.presentation =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce arcu erat, blandit et mauris in, tempor tempor risus. Quisque quis tempor velit. Suspendisse nec viverra felis. Aliquam velit mi, gravida ut leo eu, egestas suscipit eros.";
    about.description =
      "Suspendisse nec viverra felis. Aliquam velit mi, gravida ut leo eu, egestas suscipit eros. Aenean sem justo, sagittis eget malesuada in, sollicitudin a ex. Pellentesque eu est eget sapien consectetur vulputate.";
    about.imagePresentationURL =
      "https://res.cloudinary.com/dgdyzgrmi/image/upload/v1680213945/eichticiImages/dev_nkbbaf.png";
    about.imagePresentation_publicId = "eichticiImages/dev_nkbbaf";
    about.imageAboutURL =
      "https://res.cloudinary.com/dgdyzgrmi/image/upload/v1680213945/eichticiImages/dev2_ywgqj3.png";
    about.imageAbout_publicId = "eichticiImages/dev2_ywgqj3";

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
