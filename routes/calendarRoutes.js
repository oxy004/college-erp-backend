import express from "express";
import AcademicCalendar from "../models/AcademicCalendar.js";
import upload from "../middleware/calendarUpload.js";

const router = express.Router();


// CREATE OR UPDATE
router.post(
  "/add",
  upload.single("file"),
  async (req, res) => {
    try {
      let fileUrl = "";
      let fileType = "image";

      if (req.file) {
        fileUrl = `/uploads/calendar/${req.file.filename}`;

        if (req.file.mimetype === "application/pdf") {
          fileType = "pdf";
        }
      }

      const existing = await AcademicCalendar.findOne();

     const data = {
  fileUrl:
    fileUrl || existing?.fileUrl || "",

  fileType:
    fileType || existing?.fileType || "image",

  redirectUrl:
    req.body.redirectUrl ||
    existing?.redirectUrl ||
    "",
};

      if (existing) {
        const updated =
          await AcademicCalendar.findByIdAndUpdate(
            existing._id,
            data,
            { new: true }
          );

        return res.status(200).json({
          success: true,
          message: "Academic Calendar Updated",
          data: updated,
        });
      }

      const newCalendar =
        await AcademicCalendar.create(data);

      res.status(201).json({
        success: true,
        message: "Academic Calendar Created",
        data: newCalendar,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// GET
router.get("/", async (req, res) => {
  try {
    const data = await AcademicCalendar.findOne();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// DELETE
router.delete("/", async (req, res) => {
  try {
    await AcademicCalendar.deleteMany();

    res.status(200).json({
      success: true,
      message: "Academic Calendar Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;