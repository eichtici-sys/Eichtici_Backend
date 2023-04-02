import express from "express";
import {
  getSocials,
  newSocial,
  getSocial,
  editSocial,
  deleteSocial,
  getSocialsLanding,
} from "../controllers/socialController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getSocials).post(checkAuth, newSocial);
router.route("/all").get(getSocialsLanding);
router
  .route("/:id")
  .get(checkAuth, getSocial)
  .put(checkAuth, editSocial)
  .delete(checkAuth, deleteSocial);

export default router;
