import express from "express";
import ComputerLaboratory from "../models/ComputerLab.js";
import uploadLab from "../middleware/uploadLab.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

const router = express.Router();

/* =========================================================
   CREATE
========================================================= */

router.post(
  "/",
  uploadLab.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "sideImage", maxCount: 1 },
    { name: "labImages", maxCount: 50 },
  ]),
  async (req, res) => {
    try {
      const existing =
        await ComputerLaboratory.findOne();

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Computer Laboratory already exists",
        });
      }

      let bannerImage = "";
      let bannerImagePublicId = "";

      let sideImage = "";
      let sideImagePublicId = "";

      if (req.files?.bannerImage?.[0]) {
        const result =
          await uploadToCloudinary(
  req.files.bannerImage[0].buffer,
  "computer-lab/banner"
);

        bannerImage =
          result.secure_url;

        bannerImagePublicId =
          result.public_id;
      }

      if (req.files?.sideImage?.[0]) {
        const result =
          await uploadToCloudinary(
  req.files.sideImage[0].buffer,
  "computer-lab/side"
);

        sideImage =
          result.secure_url;

        sideImagePublicId =
          result.public_id;
      }

      let laboratoryUnits =
        req.body.laboratoryUnits
          ? JSON.parse(
              req.body.laboratoryUnits
            )
          : [];

      const uploadedLabImages =
        req.files?.labImages || [];

      laboratoryUnits =
        await Promise.all(
          laboratoryUnits.map(
            async (lab, index) => {
              let labImage = "";
              let labImagePublicId =
                "";

              if (
                uploadedLabImages[index]
              ) {
                const result =
                  await uploadToCloudinary(
  uploadedLabImages[index].buffer,
  "computer-lab/labs"
);

                labImage =
                  result.secure_url;

                labImagePublicId =
                  result.public_id;
              }

              return {
                ...lab,
                labImage,
                labImagePublicId,
              };
            }
          )
        );

      const newData =
        await ComputerLaboratory.create(
          {
            bannerImage,
            bannerImagePublicId,

            paragraph:
              req.body.paragraph ||
              "",

            facilities:
              req.body.facilities
                ? JSON.parse(
                    req.body.facilities
                  )
                : [],

            sideImage,
            sideImagePublicId,

            laboratoryUnits,
          }
        );

      res.status(201).json({
        success: true,
        data: newData,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed To Create Data",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   GET
========================================================= */

router.get("/", async (req, res) => {
  try {
    const data =
      await ComputerLaboratory.findOne();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =========================================================
   UPDATE
========================================================= */

router.put(
  "/",
  uploadLab.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "sideImage", maxCount: 1 },
    { name: "labImages", maxCount: 50 },
  ]),
  async (req, res) => {
    try {
      const existing =
        await ComputerLaboratory.findOne();

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "No data found",
        });
      }

      if (
        req.files?.bannerImage?.[0]
      ) {
        if (
          existing.bannerImagePublicId
        ) {
          await deleteFromCloudinary(
            existing.bannerImagePublicId
          );
        }

        const result =
          await uploadToCloudinary(
            req.files.bannerImage[0],
            "computer-lab/banner"
          );

        existing.bannerImage =
          result.secure_url;

        existing.bannerImagePublicId =
          result.public_id;
      }

      if (
        req.files?.sideImage?.[0]
      ) {
        if (
          existing.sideImagePublicId
        ) {
          await deleteFromCloudinary(
            existing.sideImagePublicId
          );
        }

        const result =
          await uploadToCloudinary(
            req.files.sideImage[0],
            "computer-lab/side"
          );

        existing.sideImage =
          result.secure_url;

        existing.sideImagePublicId =
          result.public_id;
      }

      existing.paragraph =
        req.body.paragraph ??
        existing.paragraph;

      existing.facilities =
        req.body.facilities
          ? JSON.parse(
              req.body.facilities
            )
          : existing.facilities;

      let parsedLabs =
        req.body.laboratoryUnits
          ? JSON.parse(
              req.body.laboratoryUnits
            )
          : existing.laboratoryUnits;

      const uploadedLabImages =
        req.files?.labImages || [];

      existing.laboratoryUnits =
        await Promise.all(
          parsedLabs.map(
            async (lab, index) => {
              let oldLab =
                existing
                  .laboratoryUnits[
                  index
                ] || {};

              let labImage =
                oldLab.labImage || "";

              let labImagePublicId =
                oldLab.labImagePublicId ||
                "";

              if (
                uploadedLabImages[index]
              ) {
                if (
                  oldLab.labImagePublicId
                ) {
                  await deleteFromCloudinary(
                    oldLab.labImagePublicId
                  );
                }

                const result =
                  await uploadToCloudinary(
                    uploadedLabImages[
                      index
                    ],
                    "computer-lab/labs"
                  );

                labImage =
                  result.secure_url;

                labImagePublicId =
                  result.public_id;
              }

              return {
                ...lab,
                labImage,
                labImagePublicId,
              };
            }
          )
        );

      await existing.save();

      res.status(200).json({
        success: true,
        data: existing,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Update Failed",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   DELETE
========================================================= */

router.delete(
  "/delete-all",
  async (req, res) => {
    try {
      const existing =
        await ComputerLaboratory.findOne();

      if (existing) {
        if (
          existing.bannerImagePublicId
        ) {
          await deleteFromCloudinary(
            existing.bannerImagePublicId
          );
        }

        if (
          existing.sideImagePublicId
        ) {
          await deleteFromCloudinary(
            existing.sideImagePublicId
          );
        }

        for (const lab of existing.laboratoryUnits) {
          if (
            lab.labImagePublicId
          ) {
            await deleteFromCloudinary(
              lab.labImagePublicId
            );
          }
        }
      }

      await ComputerLaboratory.deleteMany(
        {}
      );

      res.status(200).json({
        success: true,
        message:
          "Deleted Successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;