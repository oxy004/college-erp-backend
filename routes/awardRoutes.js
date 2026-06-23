import express from "express";

import {
  createAward,
  getAwards,
  getAwardById,
  updateAward,
  deleteAward,
  deleteAllAwards,
} from "../controllers/awardController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import uploadAwards from "../middleware/uploadAwards.js";

const router = express.Router();

/* Public */
router.get("/", getAwards);
router.get("/:id", getAwardById);

/* Admin */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  uploadAwards.single("image"),
  createAward
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  uploadAwards.single("image"),
  updateAward
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAward
);

router.delete(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAllAwards
);

export default router;