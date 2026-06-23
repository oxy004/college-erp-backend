import express from "express";
import uploadAcademicWork from "../middleware/uploadAcademicWork.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getAcademicWorks,
  getAcademicWork,
  createAcademicWork,
  updateAcademicWork,
  deleteAcademicWork,
  deleteAllAcademicWorks,
  toggleFeatured,
} from "../controllers/academicWorkController.js";

const router = express.Router();

router.get("/", getAcademicWorks);

router.get("/:id", getAcademicWork);

router.post(
  "/",
  authMiddleware,
  uploadAcademicWork.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 20,
    },
  ]),
  createAcademicWork
);

router.put(
  "/:id",
  authMiddleware,
  uploadAcademicWork.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 20,
    },
  ]),
  updateAcademicWork
);

router.put(
  "/:id/featured",
  authMiddleware,
  toggleFeatured
);

router.delete(
  "/:id",
  authMiddleware,
  deleteAcademicWork
);

router.delete(
  "/",
  authMiddleware,
  deleteAllAcademicWorks
);

export default router;