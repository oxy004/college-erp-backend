import express from "express";

import uploadPhotoGallery from "../middleware/uploadPhotoGallery.js";

import {
  getPhotoGallery,

  uploadHeroImage,
  deleteHeroImage,

  addFeaturedPhoto,
  updateFeaturedPhoto,
  deleteFeaturedPhoto,

  addYearFolder,
  updateYearFolder,
  deleteYearFolder,

  addAlbum,
  updateAlbum,
  deleteAlbum,

  addPhotosToAlbum,
  deletePhotoFromAlbum,
} from "../controllers/photoGalleryController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router =
  express.Router();

/* PUBLIC */

router.get(
  "/",
  getPhotoGallery
);

/* ADMIN */

router.use(authMiddleware);

/* HERO */

router.post(
  "/hero",
  uploadPhotoGallery.single(
    "image"
  ),
  uploadHeroImage
);

router.delete(
  "/hero/:index",
  deleteHeroImage
);

/* FEATURED */

router.post(
  "/featured",
  uploadPhotoGallery.single(
    "image"
  ),
  addFeaturedPhoto
);

router.delete(
  "/featured/:id",
  deleteFeaturedPhoto
);

/* YEARS */

router.post(
  "/year",
  addYearFolder
);

router.put(
  "/year/:yearId",
  updateYearFolder
);

router.put(
  "/featured/:id",
  uploadPhotoGallery.single(
    "image"
  ),
  updateFeaturedPhoto
);

router.put(
  "/albums/:albumId",
  uploadPhotoGallery.single(
    "coverImage"
  ),
  updateAlbum
);

router.delete(
  "/year/:yearId",
  deleteYearFolder
);

/* ALBUMS */

router.post(
  "/year/:yearId/albums",
  uploadPhotoGallery.single(
    "coverImage"
  ),
  addAlbum
);

router.delete(
  "/albums/:albumId",
  deleteAlbum
);

/* PHOTOS */

router.post(
  "/albums/:albumId/photos",
  uploadPhotoGallery.array(
    "photos",
    100
  ),
  addPhotosToAlbum
);

router.delete(
  "/albums/:albumId/photos/:photoId",
  deletePhotoFromAlbum
);

export default router;