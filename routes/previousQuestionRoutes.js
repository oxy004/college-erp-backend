import express from "express";

import uploadQuestion from "../middleware/uploadQuestion.js";

import {
  createPaper,
  getAllPapers,
  getPaperById,
  updatePaper,
  deletePaper,
  searchPapers,
  filterPapers,
} from "../controllers/previousQuestionController.js";

const router = express.Router();

router.post(
  "/",
  uploadQuestion.single("pdfFile"),
  createPaper
);

router.get("/", getAllPapers);

router.get("/search", searchPapers);

router.get("/filter", filterPapers);

router.get("/:id", getPaperById);

router.put(
  "/:id",
  uploadQuestion.single("pdfFile"),
  updatePaper
);

router.delete("/:id", deletePaper);

export default router;