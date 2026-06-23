import express from "express";

import {
  createProcedure,
  getProcedures,
  updateProcedure,
  deleteProcedure,
} from "../controllers/admissionProcedureController.js";

const router = express.Router();

router.post("/create", createProcedure);

router.get("/all", getProcedures);

router.put("/:id", updateProcedure);

router.delete("/:id", deleteProcedure);

export default router;

