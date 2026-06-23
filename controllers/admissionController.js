import Admission from "../models/Admission.js";

/* =========================
   CREATE
========================= */

export const createAdmission = async (req, res) => {
  try {
    const admission = await Admission.create(req.body);

    res.status(201).json({
      success: true,
      admission,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
};

/* =========================
   GET ALL
========================= */

export const getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      admissions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
    });
  }
};

/* =========================
   DELETE
========================= */

export const deleteAdmission = async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

/* =========================
   UPDATE STATUS
========================= */

export const updateAdmissionStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const updatedAdmission =
      await Admission.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    res.status(200).json({
      success: true,
      updatedAdmission,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};