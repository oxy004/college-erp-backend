import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    audience: {
      type: String,
      enum: ["student", "faculty"],
      required: true,
    },

    pdfFile: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },

    noticeDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Notice",
  noticeSchema
);