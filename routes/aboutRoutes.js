import express from "express";

import {
  getAboutLanding,
  getAbouts,
  getAbout,
  editAbout,
  changeImagePresentation,
  changeImageAbout,
  changeImageResumen,
  changeImageBackground,
} from "../controllers/aboutController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getAbouts);
router.route("/all").get(getAboutLanding);
router.route("/imgpres/:id").put(checkAuth, changeImagePresentation);
router.route("/image-about/:id").put(checkAuth, changeImageAbout);
router.route("/image-resumen/:id").put(checkAuth, changeImageResumen);
router.route("/image-background/:id").put(checkAuth, changeImageBackground);
router.route("/:id").get(checkAuth, getAbout).put(checkAuth, editAbout);

export default router;
