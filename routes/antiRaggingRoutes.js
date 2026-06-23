import express from "express";
import AntiRagging from "../models/AntiRagging.js";

import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();


// ============================================
// CREATE
// ============================================

router.post(
  "/",
  upload.any(),
  async (req, res) => {
    try {
      const existing = await AntiRagging.findOne();

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Anti Ragging data already exists",
        });
      }

      const data = JSON.parse(req.body.data || "{}");

      const files = req.files || [];

      // HERO IMAGE
      const heroImage = files.find(
        (file) => file.fieldname === "heroBackgroundImage"
      );

      if (heroImage) {
        const result = await cloudinary.uploader.upload(heroImage.path);
        data.heroBackgroundImage = result.secure_url;
      }

      // POSTER IMAGES
      if (data.posters?.length) {
        for (let i = 0; i < data.posters.length; i++) {
          const file = files.find(
            (f) => f.fieldname === `posterImage_${i}`
          );

          if (file) {
            const result = await cloudinary.uploader.upload(file.path);
            data.posters[i].image = result.secure_url;
          }
        }
      }

      // COMMITTEE IMAGES
      if (data.committee?.length) {
        for (let i = 0; i < data.committee.length; i++) {
          const file = files.find(
            (f) => f.fieldname === `committeeImage_${i}`
          );

          if (file) {
            const result = await cloudinary.uploader.upload(file.path);
            data.committee[i].image = result.secure_url;
          }
        }
      }

      const antiRagging = await AntiRagging.create(data);

      res.status(201).json({
        success: true,
        data: antiRagging,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// ============================================
// GET
// ============================================

router.get("/", async (req, res) => {
  try {
    const antiRagging = await AntiRagging.findOne();

    res.status(200).json({
      success: true,
      data: antiRagging,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ============================================
// UPDATE
// ============================================

router.put(
  "/",
  upload.any(),
  async (req, res) => {
    try {
      const existing = await AntiRagging.findOne();

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "No Anti Ragging data found",
        });
      }

      const data = JSON.parse(req.body.data || "{}");

      const files = req.files || [];

      // HERO IMAGE
      const heroImage = files.find(
        (file) => file.fieldname === "heroBackgroundImage"
      );

      if (heroImage) {
        const result = await cloudinary.uploader.upload(heroImage.path);
        data.heroBackgroundImage = result.secure_url;
      } else {
        data.heroBackgroundImage =
          data.heroBackgroundImage ||
          existing.heroBackgroundImage;
      }

      // POSTERS
      if (data.posters?.length) {
        for (let i = 0; i < data.posters.length; i++) {
          const file = files.find(
            (f) => f.fieldname === `posterImage_${i}`
          );

          if (file) {
            const result = await cloudinary.uploader.upload(file.path);

            data.posters[i].image = result.secure_url;
          } else {
            data.posters[i].image =
              data.posters[i].image ||
              existing.posters?.[i]?.image ||
              "";
          }
        }
      }

      // COMMITTEE
      if (data.committee?.length) {
        for (let i = 0; i < data.committee.length; i++) {
          const file = files.find(
            (f) => f.fieldname === `committeeImage_${i}`
          );

          if (file) {
            const result = await cloudinary.uploader.upload(file.path);

            data.committee[i].image = result.secure_url;
          } else {
            data.committee[i].image =
              data.committee[i].image ||
              existing.committee?.[i]?.image ||
              "";
          }
        }
      }

      const updated = await AntiRagging.findByIdAndUpdate(
        existing._id,
        {
          ...existing.toObject(),
          ...data,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// ============================================
// DELETE ALL
// ============================================

router.delete("/", async (req, res) => {
  try {
    await AntiRagging.deleteMany({});

    res.status(200).json({
      success: true,
      message: "Anti Ragging data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;