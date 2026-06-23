import mongoose from "mongoose";

const academicCalendarSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      enum: ["image", "pdf"],
      default: "image",
    },

    redirectUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const AcademicCalendar = mongoose.model(
  "AcademicCalendar",
  academicCalendarSchema
);

export default AcademicCalendar;