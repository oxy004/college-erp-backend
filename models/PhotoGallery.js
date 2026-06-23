import mongoose from "mongoose";

/* ==========================================
PHOTO
========================================== */

const photoSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },

  publicId: {
    type: String,
    default: "",
  },

  caption: {
    type: String,
    default: "",
  },
});

/* ==========================================
ALBUM
========================================== */

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  coverImage: {
    type: String,
    default: "",
  },

  publicId: {
    type: String,
    default: "",
  },

  eventDate: {
    type: Date,
  },

  photos: [photoSchema],
});

/* ==========================================
YEAR FOLDER
========================================== */

const yearFolderSchema =
  new mongoose.Schema({
    year: {
      type: String,
      required: true,
    },

    albums: [albumSchema],
  });

/* ==========================================
FEATURED PHOTO
========================================== */

const featuredPhotoSchema =
  new mongoose.Schema({
    image: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
  });

/* ==========================================
HERO IMAGE
========================================== */

const heroImageSchema =
  new mongoose.Schema({
    image: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: "",
    },
  });

/* ==========================================
MAIN SCHEMA
========================================== */

const photoGallerySchema =
  new mongoose.Schema(
    {
      heroImages: [
        heroImageSchema,
      ],

      featuredPhotos: [
        featuredPhotoSchema,
      ],

      yearFolders: [
        yearFolderSchema,
      ],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "PhotoGallery",
  photoGallerySchema
);