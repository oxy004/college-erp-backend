import express from "express";
import WebMagazine from "../models/Webmagazine.js";
import upload from "../middleware/uploadWebMagazine.js";
import cloudinary from "../config/cloudinary.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

const router = express.Router();

/* =========================================
   CREATE
========================================= */

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let image = "";
      let imagePublicId = "";

      if (req.files?.image?.[0]) {
        const uploadedImage = await uploadToCloudinary(
          req.files.image[0].buffer,
          "web-magazine/images",
          "image"
        );

        image = uploadedImage.secure_url;
        imagePublicId = uploadedImage.public_id;
      }

      let pdfFile = "";
      let pdfPublicId = "";

      if (req.files?.pdfFile?.[0]) {
   const uploadedPdf = await cloudinary.uploader.upload(
  `data:application/pdf;base64,${req.files.pdfFile[0].buffer.toString("base64")}`,
  {
    folder: "web-magazine/pdfs",
    resource_type: "raw",
    format: "pdf",
  }
);

        pdfFile = uploadedPdf.secure_url;
        pdfPublicId = uploadedPdf.public_id;
      }

      const magazine = await WebMagazine.create({
        title: req.body.title,
        subtitle: req.body.subtitle,
        author: req.body.author,
        category: req.body.category,
        edition: req.body.edition,
        publicationDate: req.body.publicationDate,
        year: req.body.year,

        image,
        imagePublicId,

        pdfFile,
        pdfPublicId,
      });

      res.status(201).json({
        success: true,
        message: "Magazine created successfully",
        data: magazine,
      });
    } catch (error) {
      console.error("CREATE MAGAZINE ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create magazine",
        error: error.message,
      });
    }
  }
);

/* =========================================
   GET ALL
========================================= */

router.get("/", async (req, res) => {
  try {
    const magazines = await WebMagazine.find().sort({
      year: -1,
      publicationDate: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: magazines,
    });
  } catch (error) {
    console.error("GET MAGAZINES ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================================
   GET SINGLE
========================================= */

router.get("/:id", async (req, res) => {
  try {
    const magazine = await WebMagazine.findById(req.params.id);

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Magazine not found",
      });
    }

    res.status(200).json({
      success: true,
      data: magazine,
    });
  } catch (error) {
    console.error("GET MAGAZINE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================================
   UPDATE
========================================= */

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const existing = await WebMagazine.findById(req.params.id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Magazine not found",
        });
      }

      let image = existing.image;
      let imagePublicId = existing.imagePublicId;

      if (req.files?.image?.[0]) {
        if (existing.imagePublicId) {
          await deleteFromCloudinary(
            existing.imagePublicId,
            "image"
          );
        }

        const uploadedImage = await uploadToCloudinary(
          req.files.image[0].buffer,
          "web-magazine/images",
          "image"
        );

        image = uploadedImage.secure_url;
        imagePublicId = uploadedImage.public_id;
      }

      let pdfFile = existing.pdfFile;
      let pdfPublicId = existing.pdfPublicId;

      if (req.files?.pdfFile?.[0]) {
        if (existing.pdfPublicId) {
          await deleteFromCloudinary(
            existing.pdfPublicId,
            "raw"
          );
        }

        const uploadedPdf = await uploadToCloudinary(
          req.files.pdfFile[0].buffer,
          "web-magazine/pdfs",
          "raw"
        );

        pdfFile = uploadedPdf.secure_url;
        pdfPublicId = uploadedPdf.public_id;
      }

      const updated = await WebMagazine.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          subtitle: req.body.subtitle,
          author: req.body.author,
          category: req.body.category,
          edition: req.body.edition,
          publicationDate: req.body.publicationDate,
          year: req.body.year,

          image,
          imagePublicId,

          pdfFile,
          pdfPublicId,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "Magazine updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("UPDATE MAGAZINE ERROR:", error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/* =========================================
   DELETE
========================================= */

router.delete("/:id", async (req, res) => {
  try {
    const magazine = await WebMagazine.findById(req.params.id);

    if (!magazine) {
      return res.status(404).json({
        success: false,
        message: "Magazine not found",
      });
    }

    if (magazine.imagePublicId) {
      await deleteFromCloudinary(
        magazine.imagePublicId,
        "image"
      );
    }

    if (magazine.pdfPublicId) {
      await deleteFromCloudinary(
        magazine.pdfPublicId,
        "raw"
      );
    }

    await WebMagazine.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Magazine deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MAGAZINE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;