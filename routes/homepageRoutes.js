import express from "express";

import Homepage from "../models/Homepage.js";

import auth from "../middleware/authMiddleware.js";

import uploadSlider from "../middleware/uploadSlider.js";

const router = express.Router();




// GET HOMEPAGE
router.get("/", async (req, res) => {

  try {

    const data =
      await Homepage.findOne();




    res.json(data);

  } catch (error) {

    console.log(error);




    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

});




// CREATE HOMEPAGE
router.post("/", auth, async (req, res) => {
  try {
    const { _id, ...payload } = req.body;

    let homepage = await Homepage.findOne();

    if (homepage) {
      homepage = await Homepage.findByIdAndUpdate(
        homepage._id,
        payload,
        { new: true }
      );
    } else {
      homepage = await Homepage.create(payload);
    }

    res.json(homepage);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});




// UPDATE HOMEPAGE
router.put("/:id", auth, async (req, res) => {

  try {

    const updated =
      await Homepage.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }

      );




    res.json(updated);

  } catch (error) {

    console.log(error);




    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

});

router.post(
  "/upload-slider",
  auth,
  uploadSlider.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      res.json({
        success: true,
        url: `/uploads/sliders/${req.file.filename}`,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);




export default router;