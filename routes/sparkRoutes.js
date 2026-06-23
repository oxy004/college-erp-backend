import express from "express";
import SparkQuestFest from "../models/SparkQuestFest.js";

const router = express.Router();



/* ==========================
   CREATE / UPDATE
========================== */

router.post("/add", async (req, res) => {
  try {
    const existing = await SparkQuestFest.findOne();

    if (existing) {
      const updated = await SparkQuestFest.findByIdAndUpdate(
        existing._id,
        {
          ...req.body,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Spark Quest Updated Successfully",
        data: updated,
      });
    }

    const created = await SparkQuestFest.create(req.body);

    res.status(201).json({
      success: true,
      message: "Spark Quest Created Successfully",
      data: created,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



/* ==========================
   GET DATA
========================== */

router.get("/", async (req, res) => {
  try {
    const data = await SparkQuestFest.findOne();

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



/* ==========================
   DELETE ALL
========================== */

router.delete("/delete", async (req, res) => {
  try {
    await SparkQuestFest.deleteMany({});

    res.status(200).json({
      success: true,
      message: "Spark Quest Data Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;