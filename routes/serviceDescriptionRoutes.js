import express from "express";

import {
  newDescription,
  getDescription,
  editDescription,
  deleteDescription,
} from "../controllers/serviceDescriptionController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/", checkAuth, newDescription);

router
  .route("/:id")
  .get(checkAuth, getDescription)
  .put(checkAuth, editDescription)
  .delete(checkAuth, deleteDescription);

export default router;
