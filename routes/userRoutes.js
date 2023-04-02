import express from "express";
import {
  register,
  authenticate,
  confirm,
  resetPassword,
  checkToken,
  newPassword,
  adminProfile,
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", register);
router.post("/login", authenticate);
router.get("/confirm/:token", confirm);
router.post("/reset-password", resetPassword);
router.route("/reset-password/:token").get(checkToken).post(newPassword);
router.get("/admin-profile", checkAuth, adminProfile);

export default router;
