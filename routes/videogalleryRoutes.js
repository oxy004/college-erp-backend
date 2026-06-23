import express from "express";
import VideoGallery from "../models/Videogallery.js";

const router = express.Router();

// ============================================
// CREATE VIDEO GALLERY (ONLY IF EMPTY)
// ============================================

router.post("/", async (req, res) => {
  try {
    const existingGallery = await VideoGallery.findOne();

    if (existingGallery) {
      return res.status(400).json({
        success: false,
        message: "Video Gallery already exists. Please use Update.",
      });
    }

    const gallery = await VideoGallery.create({
      bannerVideo: req.body.bannerVideo || "",
      promoVideo: req.body.promoVideo || "",
      paragraph: req.body.paragraph || "",
      alumniTalks: req.body.alumniTalks || [],
    });

    res.status(201).json({
      success: true,
      message: "Video Gallery Created Successfully ✅",
      data: gallery,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to Create Video Gallery",
      error: error.message,
    });
  }
});

// ============================================
// GET SINGLE VIDEO GALLERY
// ============================================

router.get("/", async (req, res) => {
  try {
    const gallery = await VideoGallery.findOne();

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to Fetch Video Gallery",
      error: error.message,
    });
  }
});

// ============================================
// UPDATE VIDEO GALLERY
// ============================================

router.put("/", async (req, res) => {
  try {
    const existingGallery = await VideoGallery.findOne();

    if (!existingGallery) {
      return res.status(404).json({
        success: false,
        message: "Video Gallery not found",
      });
    }

    existingGallery.bannerVideo =
      req.body.bannerVideo ?? existingGallery.bannerVideo;

    existingGallery.promoVideo =
      req.body.promoVideo ?? existingGallery.promoVideo;

    existingGallery.paragraph =
      req.body.paragraph ?? existingGallery.paragraph;

    existingGallery.alumniTalks =
      req.body.alumniTalks ?? existingGallery.alumniTalks;

    const updatedGallery = await existingGallery.save();

    res.status(200).json({
      success: true,
      message: "Video Gallery Updated Successfully ✅",
      data: updatedGallery,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to Update Video Gallery",
      error: error.message,
    });
  }
});

// ============================================
// DELETE ALL VIDEO GALLERY DATA
// ============================================

router.delete("/", async (req, res) => {
  try {
    await VideoGallery.deleteMany({});

    res.status(200).json({
      success: true,
      message: "Video Gallery Deleted Successfully ✅",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to Delete Video Gallery",
      error: error.message,
    });
  }
});

export default router;