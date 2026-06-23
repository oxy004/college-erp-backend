import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema(
  {
    pdfTitle: {
      type: String,
      default: "",
      trim: true,
    },

    pdfFile: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const librarySchema = new mongoose.Schema(
  {
    // ==========================
    // ABOUT LIBRARY
    // ==========================
    title: {
      type: String,
      default: "",
      trim: true,
    },

    paragraph: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // ONLINE LIBRARY
    // ==========================
    onlineLibrary: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // READING ROOM
    // ==========================
    readingRoom: {
      type: String,
      default: "",
      trim: true,
    },

    sideImage: {
      type: String,
      default: "",
    },

    // ==========================
    // LIBRARIAN
    // ==========================
    librarian: {
      avatar: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        default: "",
        trim: true,
      },

      designation: {
        type: String,
        default: "",
        trim: true,
      },

      qualification: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // ==========================
    // E-BOOKS
    // ==========================
    ebooks: {
      type: [ebookSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Library",
  librarySchema
);