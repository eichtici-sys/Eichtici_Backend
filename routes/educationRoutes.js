import express from "express";
import {
  getEducations,
  newEducation,
  getEducation,
  editEducation,
  deleteEducation,
  getAllEducations,
} from "../controllers/educationController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getEducations).post(checkAuth, newEducation);
router.route("/all").get(getAllEducations);

router
  .route("/:id")
  .get(checkAuth, getEducation)
  .put(checkAuth, editEducation)
  .delete(checkAuth, deleteEducation);

export default router;
