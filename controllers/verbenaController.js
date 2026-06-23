import Verbena from "../models/Verbena.js";

export const getVerbena = async (req, res) => {
  try {
    const data = await Verbena.findOne();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createVerbena = async (req, res) => {
  try {
    const existing = await Verbena.findOne();

    if (existing) {
      return res.status(400).json({
        message: "Verbena CMS already exists",
      });
    }

    const verbena = await Verbena.create(req.body);

    res.status(201).json(verbena);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateVerbena = async (req, res) => {
  try {
    const existing = await Verbena.findOne();

    if (!existing) {
      return res.status(404).json({
        message: "Verbena CMS not found",
      });
    }

    const updated = await Verbena.findByIdAndUpdate(
      existing._id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteVerbena = async (req, res) => {
  try {
    await Verbena.deleteMany();

    res.json({
      message: "Verbena CMS deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};