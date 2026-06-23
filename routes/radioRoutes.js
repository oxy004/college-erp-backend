import express from "express";

import RadioTih from "../models/RadioTih.js";

const router = express.Router();




// CREATE ONLY IF DATABASE EMPTY
router.post("/", async (req, res) => {

  try {

    // CHECK EXISTING DATA
    const existingData = await RadioTih.findOne();




    if (existingData) {

      return res.status(400).json({
        success: false,
        message: "Radio TIH Data Already Exists ⚠️",
      });

    }




    const data = {
      bannerVideo: req.body.bannerVideo || "",
      programList: req.body.programList || [],
    };




    const newRadiotih = await RadioTih.create(data);




    res.status(200).json({
      success: true,
      message: "Saved Successfully ✅",
      data: newRadiotih,
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




// GET SINGLE DATA
router.get("/", async (req, res) => {

  try {

    const data = await RadioTih.findOne();




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




// UPDATE DATA
router.put("/:id", async (req, res) => {

  try {

    const existingData = await RadioTih.findById(
      req.params.id
    );




    if (!existingData) {

      return res.status(404).json({
        success: false,
        message: "Data Not Found ❌",
      });

    }




    const updatedData = await RadioTih.findByIdAndUpdate(

      req.params.id,

      {
        bannerVideo:
          req.body.bannerVideo || existingData.bannerVideo,

        programList:
          req.body.programList?.length > 0
            ? req.body.programList
            : existingData.programList,
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

    const deletedData = await RadioTih.findByIdAndDelete(
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