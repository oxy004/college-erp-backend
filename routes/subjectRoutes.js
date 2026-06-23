import express from "express";

import {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

import auth from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  auth,
  roleMiddleware("admin"),
  createSubject
);

router.get("/", getSubjects);

router.put(
  "/:id",
  auth,
  roleMiddleware("admin"),
  updateSubject
);

router.delete(
  "/:id",
  auth,
  roleMiddleware("admin"),
  deleteSubject
);

export default router;