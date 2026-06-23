import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();


// =====================================
// CREATE ENQUIRY
// =====================================

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      queryType,
      message,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !queryType ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const enquiry = await Contact.create({
      fullName,
      email,
      phone,
      queryType,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// =====================================
// GET ALL ENQUIRIES
// =====================================

router.get("/", async (req, res) => {
  try {
    const enquiries = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// =====================================
// GET SINGLE ENQUIRY
// =====================================

router.get("/:id", async (req, res) => {
  try {
    const enquiry = await Contact.findById(
      req.params.id
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// =====================================
// UPDATE STATUS
// =====================================

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await Contact.findById(
      req.params.id
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    enquiry.status = status;

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      enquiry,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// =====================================
// DELETE ENQUIRY
// =====================================

router.delete("/:id", async (req, res) => {
  try {
    const enquiry = await Contact.findById(
      req.params.id
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await enquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;