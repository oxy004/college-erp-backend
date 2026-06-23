import express from "express";

import {
  getVerbena,
  createVerbena,
  updateVerbena,
  deleteVerbena,
} from "../controllers/verbenaController.js";

const router = express.Router();

router.get("/", getVerbena);

router.post("/", createVerbena);

router.put("/", updateVerbena);

router.delete("/", deleteVerbena);

export default router;