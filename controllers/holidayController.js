import Holiday from "../models/Holiday.js";

// GET ALL HOLIDAYS
export const getHolidays = async (req, res) => {
  try {
    const holidays =
  await Holiday.find().sort({
    date: 1,
  });

    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch holidays",
      error: error.message,
    });
  }
};

// CREATE HOLIDAY
export const createHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.create(req.body);

    res.status(201).json({
      message: "Holiday added successfully",
      holiday,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create holiday",
      error: error.message,
    });
  }
};

// UPDATE HOLIDAY
export const updateHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!holiday) {
      return res.status(404).json({
        message: "Holiday not found",
      });
    }

    res.status(200).json({
      message: "Holiday updated successfully",
      holiday,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update holiday",
      error: error.message,
    });
  }
};

// DELETE HOLIDAY
export const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);

    if (!holiday) {
      return res.status(404).json({
        message: "Holiday not found",
      });
    }

    res.status(200).json({
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete holiday",
      error: error.message,
    });
  }
};

// GET SINGLE HOLIDAY
export const getHolidayById = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);

    if (!holiday) {
      return res.status(404).json({
        message: "Holiday not found",
      });
    }

    res.status(200).json(holiday);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch holiday",
      error: error.message,
    });
  }
};