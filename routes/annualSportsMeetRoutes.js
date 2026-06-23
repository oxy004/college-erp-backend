import express from "express";
import uploadSports from "../middleware/uploadSports.js";

import {
  getAnnualSportsMeet,
  createOrUpdateAnnualSportsMeet,

  addSportsEvent,
  updateSportsEvent,
  deleteSportsEvent,

  addGalleryImage,
  deleteGalleryImage,
} from "../controllers/annualSportsMeetController.js";

const router = express.Router();

router.get(
  "/",
  getAnnualSportsMeet
);

router.put(
  "/",
  uploadSports.single("heroImage"),
  createOrUpdateAnnualSportsMeet
);

router.post(
  "/events",
  uploadSports.single("image"),
  addSportsEvent
);

router.put(
  "/events/:id",
  uploadSports.single("image"),
  updateSportsEvent
);

router.delete(
  "/events/:id",
  deleteSportsEvent
);

router.post(
  "/gallery",
  uploadSports.single("image"),
  addGalleryImage
);

router.delete(
  "/gallery/:id",
  deleteGalleryImage
);

export default router;