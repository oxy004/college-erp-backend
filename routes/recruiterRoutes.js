import express from "express";
import uploadRecruiter from "../middleware/uploadRecruiter.js";

import {
  createRecruiter,
  getRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.post(
  "/",
  uploadRecruiter.single("logo"),
  createRecruiter
);

router.get("/", getRecruiters);

router.get("/:id", getRecruiterById);

router.put(
  "/:id",
  uploadRecruiter.single("logo"),
  updateRecruiter
);

router.delete("/:id", deleteRecruiter);

export default router;