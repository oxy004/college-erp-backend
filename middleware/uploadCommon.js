import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes =
    /jpg|jpeg|png|webp|svg/;

  const isValidMime =
    allowedTypes.test(file.mimetype);

  const isValidExt =
    allowedTypes.test(
      file.originalname.toLowerCase()
    );

  if (isValidMime || isValidExt) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and SVG images are allowed"
      )
    );
  }
};

const uploadCommon = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default uploadCommon;