import express from "express";

import {
  newSkill,
  getSkill,
  editSkill,
  deleteSkill,
  getSkills,
} from "../controllers/skillController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getSkills).post(checkAuth, newSkill);

router
  .route("/:id")
  .get(checkAuth, getSkill)
  .put(checkAuth, editSkill)
  .delete(checkAuth, deleteSkill);

export default router;
