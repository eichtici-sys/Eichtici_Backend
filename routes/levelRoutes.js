import express from "express";

import {
  getLevels,
  newLevel,
  getLevel,
  editLevel,
  deleteLevel,
  getTotalSkills,
  getAllLevels,
} from "../controllers/levelController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getLevels).post(checkAuth, newLevel);
router.route("/all").get(getAllLevels);
router.get("/total-skills", checkAuth, getTotalSkills);
router
  .route("/:id")
  .get(checkAuth, getLevel)
  .put(checkAuth, editLevel)
  .delete(checkAuth, deleteLevel);

export default router;
