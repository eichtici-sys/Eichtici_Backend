import Mail from "../models/Mail.js";
import { emailContact } from "../helpers/email.js";

const getMails = async (req, res) => {
  const emails = await Mail.find().where("user").equals(req.user);
  res.json(emails);
};

const newEmail = async (req, res) => {
  const { email, name, message } = req.body;
  const regexEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regexName = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g;

  if ([email, name, message].includes("")) {
    const error = new Error("Invalid Field. All fields required");
    return res.status(400).json({ msg: error.message });
  }

  if (!regexEmail.test(email)) {
    const error = new Error("Invalid Email");
    return res.status(400).json({ msg: error.message });
  }
  if (name.length < 3) {
    const error = new Error("Invalid Name");
    return res.status(400).json({ msg: error.message });
  }

  if (message.length < 20) {
    const error = new Error("The message field must be at least 20 characters");
    return res.status(400).json({ msg: error.message });
  }

  if (!regexName.test(name)) {
    const error = new Error("The name can only contain letters.");
    return res.status(400).json({ msg: error.message });
  }

  const emailUser = new Mail(req.body);
  emailUser.user = process.env.ID_ADMIN;

  try {
    const emailStore = await emailUser.save();
    emailContact({
      emai: emailUser.email,
      name: emailUser.name,
      message: emailUser.message,
    });

    res.json({
      msg: "Email enviado correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const changeState = async (req, res) => {
  const { id } = req.params;
  const email = await Mail.findById(id);
  if (!email) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (email.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  email.state = !email.state;

  const emailStore = await email.save();
  res.json(emailStore);
};

const changePotential = async (req, res) => {
  const { id } = req.params;
  const email = await Mail.findById(id);
  if (!email) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (email.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  email.potential = !email.potential;

  const emailStore = await email.save();
  res.json(emailStore);
};

export { newEmail, changeState, getMails, changePotential };
