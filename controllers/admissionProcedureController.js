import AdmissionProcedure from "../models/AdmissionProcedure.js";

/* =========================
   CREATE
========================= */

export const createProcedure = async (
  req,
  res
) => {
  try {
    const procedure =
      await AdmissionProcedure.create(
        req.body
      );

    res.status(201).json({
      success: true,
      procedure,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Create failed",
    });
  }
};

/* =========================
   GET ALL
========================= */

export const getProcedures = async (
  req,
  res
) => {
  try {
    const procedures =
      await AdmissionProcedure.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      procedures,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Fetch failed",
    });
  }
};

/* =========================
   UPDATE
========================= */

export const updateProcedure = async (
  req,
  res
) => {
  try {
    const updated =
      await AdmissionProcedure.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      updated,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/* =========================
   DELETE
========================= */

export const deleteProcedure = async (
  req,
  res
) => {
  try {
    await AdmissionProcedure.findByIdAndDelete(
      req.params.id
    );

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

