import express from "express";

import {
  getCvs,
  newCv,
  deleteCv,
  changeStateCv,
  downloadCv,
  getCV,
  downloadLastCV,
} from "../controllers/curriculumController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getCvs).post(checkAuth, newCv);
router.route("/last").get(downloadLastCV);
router.route("/:id").get(checkAuth, getCV).delete(checkAuth, deleteCv);
router.post("/state/:id", checkAuth, changeStateCv);
router.get("/download/:id", checkAuth, downloadCv);

export default router;
