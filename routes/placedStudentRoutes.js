import express from "express";
import uploadPlacedStudent from "../middleware/uploadPlacedStudent.js";

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/placedStudentController.js";

const router = express.Router();

router.post(
  "/",
  uploadPlacedStudent.single("image"),
  createStudent
);

router.get("/", getStudents);

router.get("/:id", getStudentById);

router.put(
  "/:id",
  uploadPlacedStudent.single("image"),
  updateStudent
);

router.delete("/:id", deleteStudent);

export default router;