import express from "express";

import {
  createAdmission,
  getAdmissions,
  deleteAdmission,
  updateAdmissionStatus,
} from "../controllers/admissionController.js";

const router = express.Router();

router.post("/create", createAdmission);

router.get("/all", getAdmissions);

router.delete("/:id", deleteAdmission);

router.put("/:id/status", updateAdmissionStatus);

export default router;