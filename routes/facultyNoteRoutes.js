import express from "express";

import {
  createFacultyNote,
  getAllFacultyNotes,
  getStudentNotes,
  getFacultyNoteById,
  updateFacultyNote,
  deleteFacultyNote,
  getMyFacultyNotes,
  searchFacultyNotes,
} from "../controllers/facultyNoteController.js";

import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  facultyOnly,
  studentOnly,
} from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create

router.post(
  "/",
  authMiddleware,
  facultyOnly,
  upload.single("pdfFile"),
  createFacultyNote
);

// My Notes

router.get(
  "/my-notes",
  authMiddleware,
  facultyOnly,
  getMyFacultyNotes
);

// Search

router.get(
  "/search",
  authMiddleware,
  facultyOnly,
  searchFacultyNotes
);

// Get All (Faculty)

router.get(
  "/",
  authMiddleware,
  facultyOnly,
  getAllFacultyNotes
);

// Student Access

router.get(
  "/student",
  authMiddleware,
  studentOnly,
  getStudentNotes
);

// Get One

router.get(
  "/:id",
  authMiddleware,
  facultyOnly,
  getFacultyNoteById
);

// Update

router.put(
  "/:id",
  authMiddleware,
  facultyOnly,
  upload.single("pdfFile"),
  updateFacultyNote
);

// Delete

router.delete(
  "/:id",
  authMiddleware,
  facultyOnly,
  deleteFacultyNote
);

export default router;