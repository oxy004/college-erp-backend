import express from "express";

import {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  getFeaturedNotice,
  getStudentNotices,
  getFacultyNotices,
} from "../controllers/noticeController.js";

import uploadNotice from "../middleware/uploadNotice.js";

const router = express.Router();

router.post(
  "/",
  uploadNotice.single("pdfFile"),
  createNotice
);

router.get("/", getNotices);

router.get("/featured", getFeaturedNotice);

router.get("/student", getStudentNotices);

router.get("/faculty", getFacultyNotices);

router.get("/:id", getNoticeById);

router.put(
  "/:id",
  uploadNotice.single("pdfFile"),
  updateNotice
);

router.delete("/:id", deleteNotice);

export default router;