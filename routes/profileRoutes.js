import express from "express";
import {
  newProfile,
  getProfile,
  getProfiles,
  editProfile,
  getContact,
} from "../controllers/profileController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getProfiles).post(checkAuth, newProfile);
router.route("/contact").get(getContact);

router.route("/:id").get(checkAuth, getProfile).put(checkAuth, editProfile);

export default router;
