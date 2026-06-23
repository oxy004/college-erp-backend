import express from "express";

import {
  getFeeStructures,
  getFeeStructureByStream,
  createOrUpdateFeeStructure,
  deleteFeeStructure,
} from "../controllers/feeStructureController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadFeePdf from "../middleware/uploadFeePdf.js";

const router = express.Router();

router.get(
  "/",
  getFeeStructures
);

router.get(
  "/:stream",
  getFeeStructureByStream
);

router.post(
  "/",
  authMiddleware,
  uploadFeePdf.single("pdfFile"),
  createOrUpdateFeeStructure
);

router.put(
  "/:id",
  authMiddleware,
  uploadFeePdf.single("pdfFile"),
  createOrUpdateFeeStructure
);

router.delete(
  "/:id",
  authMiddleware,
  deleteFeeStructure
);

export default router;