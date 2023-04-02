import express from "express";

import {
  getServices,
  newService,
  getService,
  editService,
  deleteService,
  getAllServices,
} from "../controllers/serviceController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getServices).post(checkAuth, newService);
router.route("/all").get(getAllServices);

router
  .route("/:id")
  .get(checkAuth, getService)
  .put(checkAuth, editService)
  .delete(checkAuth, deleteService);

export default router;
