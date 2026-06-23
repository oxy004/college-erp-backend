import express from "express";
import Bba from "../models/Bba.js";

const router = express.Router();



// CREATE OR UPDATE
router.post("/add", async (req, res) => {

  try {

    const existing = await Bba.findOne();

    // REMOVE EMPTY VALUES
    const filteredData = {};

    Object.keys(req.body).forEach((key) => {

      if (
        req.body[key] !== "" &&
        req.body[key] !== null &&
        req.body[key] !== undefined
      ) {
        filteredData[key] = req.body[key];
      }
    });




    // UPDATE EXISTING
    if (existing) {

      const updated = await Bba.findByIdAndUpdate(
        existing._id,
        {
          $set: filteredData,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "BBA Updated Successfully",
        data: updated,
      });
    }




    // CREATE NEW
    const newData = new Bba(filteredData);

    await newData.save();

    res.status(201).json({
      success: true,
      message: "BBA Created Successfully",
      data: newData,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



// GET
router.get("/", async (req, res) => {

  try {

    const data = await Bba.findOne();

    res.status(200).json(data);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.delete("/delete", async (req, res) => {

  try {

    await Bba.deleteMany();

    res.status(200).json({
      success: true,
      message: "All BBA Data Deleted",
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