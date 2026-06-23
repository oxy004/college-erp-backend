import express from "express";
import uploadFaculty from "../middleware/uploadFaculty.js";

import {
  getFacultyMembers,
  getFacultyMemberById,
  createFacultyMember,
  updateFacultyMember,
  deleteFacultyMember,
  getFeaturedFaculty,
} from "../controllers/facultyResearchController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFacultyMembers);

router.get(
  "/featured",
  getFeaturedFaculty
);

router.get(
  "/:id",
  getFacultyMemberById
);

router.post(
  "/",
  authMiddleware,
  uploadFaculty.single("photo"),
  createFacultyMember
);

router.put(
  "/:id",
  authMiddleware,
  uploadFaculty.single("photo"),
  updateFacultyMember
);

router.delete(
  "/:id",
  authMiddleware,
  deleteFacultyMember
);

export default router;