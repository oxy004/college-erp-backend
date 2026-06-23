import multer from "multer";

const storage =
  multer.memoryStorage();

const uploadPhotoGallery =
  multer({
    storage,
    limits: {
      fileSize:
        20 * 1024 * 1024,
    },
  });

export default uploadPhotoGallery;