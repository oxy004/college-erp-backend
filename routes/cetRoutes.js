import express from "express";

import Cet from "../models/Cet.js";

const router = express.Router();




// CREATE CET DATA ONLY IF EMPTY
router.post("/", async (req, res) => {

  try {

    // CHECK EXISTING DATA
    const existingData = await Cet.findOne();

    if (existingData) {

      return res.status(400).json({
        success: false,
        message: "CET Data Already Exists ⚠️",
      });

    }




    const data = {
      paragraph: req.body.paragraph,
      bannerImage: req.body.bannerImage || "",
    };




    const newCet = await Cet.create(data);




    res.status(200).json({
      success: true,
      message: "Saved Successfully ✅",
      data: newCet,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });

  }

});




// GET SINGLE CET DATA
router.get("/", async (req, res) => {

  try {

    const data = await Cet.findOne();




    res.status(200).json({
      success: true,
      message: "Data Retrieved Successfully ✅",
      data: data,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed To Fetch Data",
      error: error.message,
    });

  }

});




// UPDATE CET DATA
router.put("/:id", async (req, res) => {

  try {

    const existingData = await Cet.findById(req.params.id);




    if (!existingData) {

      return res.status(404).json({
        success: false,
        message: "Data Not Found ❌",
      });

    }




    const updatedData = await Cet.findByIdAndUpdate(

      req.params.id,

      {
        paragraph:
          req.body.paragraph || existingData.paragraph,

        bannerImage:
          req.body.bannerImage || existingData.bannerImage,
      },

      { new: true }

    );




    res.status(200).json({
      success: true,
      message: "Updated Successfully ✅",
      data: updatedData,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update Failed",
      error: error.message,
    });

  }

});




// DELETE DATA
router.delete("/:id", async (req, res) => {

  try {

    const deletedData = await Cet.findByIdAndDelete(
      req.params.id
    );




    if (!deletedData) {

      return res.status(404).json({
        success: false,
        message: "Data Not Found ❌",
      });

    }




    res.status(200).json({
      success: true,
      message: "Deleted Successfully ✅",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete Failed",
      error: error.message,
    });

  }

});




export default router;