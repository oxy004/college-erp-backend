import mongoose from "mongoose";

const placedStudentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    package: {
      type: String,
      required: true,
    },

    placementYear: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PlacedStudent",
  placedStudentSchema
);