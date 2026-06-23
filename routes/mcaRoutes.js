import express from "express";
import Mca from "../models/Mca.js";

const router = express.Router();



// CREATE OR UPDATE
router.post("/add", async (req, res) => {

  try {

    const existing = await Mca.findOne();

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

      const updated = await Mca.findByIdAndUpdate(
        existing._id,
        {
          $set: filteredData,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "MCA Updated Successfully",
        data: updated,
      });
    }




    // CREATE NEW
    const newData = new Mca(filteredData);

    await newData.save();

    res.status(201).json({
      success: true,
      message: "MCA Created Successfully",
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

    const data = await Mca.findOne();

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

    await Mca.deleteMany();

    res.status(200).json({
      success: true,
      message: "All MCA Data Deleted",
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