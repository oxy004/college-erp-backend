import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF files are allowed"
      ),
      false
    );
  }
};

const uploadNotice = multer({
  storage,
  fileFilter,
  limits: {
    fileSize:
      20 * 1024 * 1024,
  },
});

export default uploadNotice;