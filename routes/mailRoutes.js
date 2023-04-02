import express from "express";
import {
  newEmail,
  changeState,
  getMails,
  changePotential,
} from "../controllers/mailController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getMails).post(newEmail);
router.post("/state/:id", checkAuth, changeState);
router.post("/potential/:id", checkAuth, changePotential);

export default router;
