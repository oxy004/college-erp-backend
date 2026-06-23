import express from "express";

import Testimonial from "../models/Testimonial.js";

import auth from "../middleware/authMiddleware.js";

import uploadTestimonial
from "../middleware/uploadTestimonial.js";

const router = express.Router();




// GET TESTIMONIALS
router.get("/", async (req, res) => {

  try {

    const data =
      await Testimonial.find();




    res.json(data);

  } catch (error) {

    console.log(error);




    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

});

router.post(
  "/upload",
  auth,
  uploadTestimonial.single("image"),
  async (req, res) => {
    try {
      res.json({
        image:
          `/uploads/testimonial/${req.file.filename}`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);



// CREATE TESTIMONIAL
router.post("/", auth, async (req, res) => {

  try {

    const created =
      await Testimonial.create(req.body);




    res.json(created);

  } catch (error) {

    console.log(error);




    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

});




// UPDATE TESTIMONIAL
router.put("/:id", auth, async (req, res) => {

  try {

    const updated =
      await Testimonial.findByIdAndUpdate(

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




// DELETE TESTIMONIAL
router.delete("/:id", auth, async (req, res) => {

  try {

    await Testimonial.findByIdAndDelete(
      req.params.id
    );




    res.json({
      message: "Deleted",
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