// backend/middleware/uploadQuestion.js

import multer from "multer";

const storage =
  multer.memoryStorage();

const fileFilter = (
  req,
  file,
  cb
) => {
  if (
    file.mimetype ===
    "application/pdf"
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

export default multer({
  storage,
  fileFilter,
});