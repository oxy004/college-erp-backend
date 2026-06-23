import express from "express";

import Program from "../models/Program.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();




// GET ALL PROGRAMS
router.get("/", async (req, res) => {

  try {

    const data =
      await Program.find();




    res.json(data);

  } catch (error) {

    console.log(error);




    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

});




// CREATE PROGRAM
router.post("/", auth, async (req, res) => {

  try {

    const created =
      await Program.create(req.body);




    res.json(created);

  } catch (error) {

    console.log(error);




    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

});




// UPDATE PROGRAM
router.put("/:id", auth, async (req, res) => {

  try {

    const updated =
      await Program.findByIdAndUpdate(

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




// DELETE PROGRAM
router.delete("/:id", auth, async (req, res) => {

  try {

    await Program.findByIdAndDelete(
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