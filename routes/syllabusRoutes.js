import express from "express";
import {
  getSyllabus,
  createOrUpdateSyllabus,
  deleteSyllabus,
  getStreamSyllabus,
} from "../controllers/syllabusController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import uploadSyllabus from "../middleware/uploadSyllabus.js";

const router = express.Router();

router.get("/", getSyllabus);

router.get(
  "/stream/:stream",
  getStreamSyllabus
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadSyllabus.single("pdf"),
  createOrUpdateSyllabus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSyllabus
);

export default router;