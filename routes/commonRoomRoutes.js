import express from "express";
import {
  getCommonRoom,
  createOrUpdateCommonRoom,
  addGame,
  updateGame,
  deleteGame,
} from "../controllers/commonRoomController.js";

import uploadCommon from "../middleware/uploadCommon.js";

import {
  uploadToCloudinary,
} from "../utils/uploadToCloudinary.js";

const router = express.Router();

/* ==========================================================================
   PUBLIC ROUTES
========================================================================== */

router.get("/", getCommonRoom);

/* ==========================================================================
   ADMIN ROUTES
========================================================================== */

// Create / Update Common Room
router.put(
  "/",
  uploadCommon.single("heroImage"),
  createOrUpdateCommonRoom
);

/* ==========================================================================
   CLOUDINARY IMAGE UPLOAD
========================================================================== */

router.post(
  "/upload",
  uploadCommon.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const result =
        await uploadToCloudinary(
          req.file.buffer,
          "common-room"
        );

      return res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error(
        "Upload Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  }
);

/* ==========================================================================
   GAMES CRUD
========================================================================== */

// Add Game
router.post(
  "/games",
  uploadCommon.single("image"),
  addGame
);

// Update Game
router.put(
  "/games/:id",
  uploadCommon.single("image"),
  updateGame
);

// Delete Game
router.delete(
  "/games/:id",
  deleteGame
);

export default router;