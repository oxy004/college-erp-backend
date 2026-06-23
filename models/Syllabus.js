import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema(
  {
    stream: {
      type: String,
      required: true,
      enum: ["MCA", "BCA", "BBA"],
    },

    semester: {
      type: Number,
      required: true,
    },

    syllabusType: {
      type: String,
      required: true,
      enum: ["new", "old"],
    },

    pdfFile: {
      type: String,
      required: true,
    },
    publicId: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate syllabus
syllabusSchema.index(
  {
    stream: 1,
    semester: 1,
    syllabusType: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Syllabus",
  syllabusSchema
);