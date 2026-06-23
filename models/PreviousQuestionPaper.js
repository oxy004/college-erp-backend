import mongoose from "mongoose";

const previousQuestionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    program: {
      type: String,
      enum: ["BCA", "BBA", "MCA"],
      required: true,
    },

    semester: {
    type: String,
    required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
    type: Number,
    required: true,
    min: 2017,
    max: new Date().getFullYear(),
    },

    paperType: {
      type: String,
      enum: ["New", "Old"],
      required: true,
      default: "New",
    },

    pdfFile: {
  type: String,
  required: true,
},

pdfPublicId: {
  type: String,
  default: "",
},

    downloads: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PreviousQuestionPaper",
  previousQuestionPaperSchema
);