import express from "express";

import auth from "../middleware/authMiddleware.js";

import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getFacultySubjects,
  loadStudents,
  saveAttendance,
  getStudentAttendance,
  getAttendancePercentage,
  getSubjectAttendance,
  getAttendanceByDate,
  getReportSummary,
  getLowAttendanceStudents,
  getAttendanceReport
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get(
  "/faculty-subjects",
  auth,
  roleMiddleware("faculty"),
  getFacultySubjects
);
router.get(
  "/report",
  auth,
  roleMiddleware("admin"),
  getAttendanceReport
);
router.get(
  "/percentage/:id",
  auth,
  getAttendancePercentage
);
router.get(
  "/low-attendance",
  auth,
  roleMiddleware("admin"),
  getLowAttendanceStudents
);
router.get(
  "/report-summary",
  auth,
  roleMiddleware("admin"),
  getReportSummary
);

router.get(
  "/student/:id",
  auth,
  getStudentAttendance
);
router.get(
  "/date",
  auth,
  getAttendanceByDate
);
router.get(
  "/subject/:subjectId",
  auth,
  getSubjectAttendance
);
router.get(
  "/students",
  auth,
  roleMiddleware("faculty"),
  loadStudents
);

router.post(
  "/save",
  auth,
  roleMiddleware("faculty"),
  saveAttendance
);

export default router;