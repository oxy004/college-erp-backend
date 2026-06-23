import express from "express";

import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getHolidayById,
} from "../controllers/holidayController.js";

const router = express.Router();

router.get("/", getHolidays);

router.get("/:id", getHolidayById);

router.post("/", createHoliday);

router.put("/:id", updateHoliday);

router.delete("/:id", deleteHoliday);

export default router;