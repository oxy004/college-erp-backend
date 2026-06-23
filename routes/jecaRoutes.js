import express from "express";

import Jeca from "../models/Jeca.js";

const router = express.Router();




// CREATE NEW DOCUMENT
router.post("/", async (req, res) => {

  try {

    const existingData =
      await Jeca.findOne();




    if (existingData) {

      return res.status(400).json({

        success: false,

        message:
          "Document already exists",

      });

    }




    const newJeca =
      await Jeca.create({

        paragraph:
          req.body.paragraph || "",

        bannerImage:
          req.body.bannerImage || "",

      });




    res.status(200).json({

      success: true,

      message:
        "Saved Successfully ✅",

      data: newJeca,

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




// UPDATE DOCUMENT
router.put("/update/:id", async (req, res) => {

  try {

    const existingData =
      await Jeca.findById(
        req.params.id
      );




    if (!existingData) {

      return res.status(404).json({

        success: false,

        message:
          "Document not found",

      });

    }




    if (
      req.body.paragraph !== undefined &&
      req.body.paragraph !== ""
    ) {

      existingData.paragraph =
        req.body.paragraph;

    }




    if (
      req.body.bannerImage !== undefined &&
      req.body.bannerImage !== ""
    ) {

      existingData.bannerImage =
        req.body.bannerImage;

    }




    await existingData.save();




    res.status(200).json({

      success: true,

      message:
        "Updated Successfully ✅",

      data: existingData,

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




// GET DATA
router.get("/", async (req, res) => {

  try {

    const data =
      await Jeca.find();




    res.status(200).json({

      success: true,

      message:
        "Data retrieved successfully",

      data: data,

    });

  } catch (error) {

    console.log(error);




    res.status(500).json({

      success: false,

      message:
        "Failed to Fetch Data",

      error: error.message,

    });

  }

});




// DELETE DOCUMENT
router.delete("/:id", async (req, res) => {

  try {

    const deletedData =
      await Jeca.findByIdAndDelete(
        req.params.id
      );




    if (!deletedData) {

      return res.status(404).json({

        success: false,

        message: "Data not found",

      });

    }




    res.status(200).json({

      success: true,

      message:
        "Deleted Successfully ✅",

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