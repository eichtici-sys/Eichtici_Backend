import express from "express";

import {
  newTechnology,
  getTechnology,
  editTechnology,
  deleteTechnology,
  getTecnologies,
} from "../controllers/technologyController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getTecnologies).post(checkAuth, newTechnology);

router
  .route("/:id")
  .get(checkAuth, getTechnology)
  .put(checkAuth, editTechnology)
  .delete(checkAuth, deleteTechnology);

export default router;
