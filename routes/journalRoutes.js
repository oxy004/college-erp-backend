import express from "express";
import streamifier from "streamifier";

import Journal from "../models/Journal.js";
import upload from "../middleware/uploadJournal.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/* =========================================
   CLOUDINARY UPLOAD HELPER
========================================= */

const uploadToCloudinary = (
  buffer,
  folder,
  resourceType = "image"
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/* =========================================
   GET JOURNAL CMS
========================================= */

router.get("/", async (req, res) => {
  try {
    const journal = await Journal.findOne();

    res.status(200).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================================
   CREATE / UPDATE JOURNAL PAGE
   SINGLE DOCUMENT CMS
========================================= */

router.post(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "sideImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let journal = await Journal.findOne();

      let bannerImage = journal?.bannerImage || "";
      let sideImage = journal?.sideImage || "";

      if (req.files?.bannerImage?.[0]) {
        bannerImage = await uploadToCloudinary(
          req.files.bannerImage[0].buffer,
          "journals/banner"
        );
      }

      if (req.files?.sideImage?.[0]) {
        sideImage = await uploadToCloudinary(
          req.files.sideImage[0].buffer,
          "journals/research"
        );
      }

      let journalList = [];

      if (req.body.journalList) {
        try {
          journalList = JSON.parse(req.body.journalList);
        } catch {
          journalList = [];
        }
      }

      const payload = {
        bannerImage,
        paragraph: req.body.paragraph || "",
        journalList,
        sideImage,
      };

      if (journal) {
        journal = await Journal.findByIdAndUpdate(
          journal._id,
          payload,
          {
            new: true,
          }
        );
      } else {
        journal = await Journal.create(payload);
      }

      res.status(200).json({
        success: true,
        message: "Journal Page Saved Successfully ✅",
        data: journal,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================================
   ADD RESEARCH PUBLICATION
========================================= */

router.post(
  "/publication",
  upload.single("pdfFile"),
  async (req, res) => {
    try {
      const journal = await Journal.findOne();

      if (!journal) {
        return res.status(404).json({
          success: false,
          message: "Create Journal CMS First",
        });
      }

      let pdfUrl = "";

      if (req.file) {
        pdfUrl = await uploadToCloudinary(
          req.file.buffer,
          "journals/publications",
          "raw"
        );
      }

      journal.researchPublications.push({
        title: req.body.title || "",
        authors: req.body.authors || "",
        description: req.body.description || "",
        pdfUrl,
        websiteUrl: req.body.websiteUrl || "",
      });

      await journal.save();

      res.status(200).json({
        success: true,
        message: "Publication Added Successfully ✅",
        data: journal,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================================
   UPDATE RESEARCH PUBLICATION
========================================= */

router.put(
  "/publication/:publicationId",
  upload.single("pdfFile"),
  async (req, res) => {
    try {
      const journal = await Journal.findOne();

      if (!journal) {
        return res.status(404).json({
          success: false,
          message: "Journal not found",
        });
      }

      const publication = journal.researchPublications.id(
        req.params.publicationId
      );

      if (!publication) {
        return res.status(404).json({
          success: false,
          message: "Publication not found",
        });
      }

      publication.title =
        req.body.title ?? publication.title;

      publication.authors =
        req.body.authors ?? publication.authors;

      publication.description =
        req.body.description ?? publication.description;

      publication.websiteUrl =
        req.body.websiteUrl ?? publication.websiteUrl;

      if (req.file) {
        const pdfUrl = await uploadToCloudinary(
          req.file.buffer,
          "journals/publications",
          "raw"
        );

        publication.pdfUrl = pdfUrl;
      }

      await journal.save();

      res.status(200).json({
        success: true,
        message: "Publication Updated Successfully ✅",
        data: journal,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================================
   DELETE RESEARCH PUBLICATION
========================================= */

router.delete(
  "/publication/:publicationId",
  async (req, res) => {
    try {
      const journal = await Journal.findOne();

      if (!journal) {
        return res.status(404).json({
          success: false,
          message: "Journal not found",
        });
      }

      journal.researchPublications.pull(
        req.params.publicationId
      );

      await journal.save();

      res.status(200).json({
        success: true,
        message: "Publication Deleted Successfully ✅",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================================
   DELETE ENTIRE JOURNAL CMS
========================================= */

router.delete("/all", async (req, res) => {
  try {
    await Journal.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All Journal Data Deleted Successfully ✅",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;