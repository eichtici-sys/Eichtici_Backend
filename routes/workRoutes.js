import express from "express";
import {
  getWorks,
  newWork,
  getWork,
  editWork,
  deleteWork,
  getAllWorks,
} from "../controllers/workController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getWorks).post(checkAuth, newWork);
router.route("/all").get(getAllWorks);

router
  .route("/:id")
  .get(checkAuth, getWork)
  .put(checkAuth, editWork)
  .delete(checkAuth, deleteWork);

export default router;
