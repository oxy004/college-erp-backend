import express from "express";
import AboutUs from "../models/AboutUs.js";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/* CREATE IF EMPTY */
router.post(
"/",
upload.fields([
{ name: "campusImage", maxCount: 1 },
{ name: "principalImage", maxCount: 1 },
]),
async (req, res) => {
try {
const existing = await AboutUs.findOne();


  if (existing) {
    return res.status(400).json({
      message: "About Us page already exists",
    });
  }

  let campusImageUrl = "";
  let principalImageUrl = "";

  if (req.files?.campusImage?.[0]) {
    const result =
      await cloudinary.uploader.upload(
        req.files.campusImage[0].path,
        {
          folder: "about-us",
        }
      );

    campusImageUrl = result.secure_url;
  }

  if (req.files?.principalImage?.[0]) {
    const result =
      await cloudinary.uploader.upload(
        req.files.principalImage[0].path,
        {
          folder: "about-us",
        }
      );

    principalImageUrl = result.secure_url;
  }

  const about = await AboutUs.create({
    ...req.body,
    campusImage: campusImageUrl,
    principalImage: principalImageUrl,
  });

  res.status(201).json(about);
} catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message,
  });
}


}
);

/* GET SINGLE DOCUMENT */
router.get("/", async (req, res) => {
try {
const about = await AboutUs.findOne();


res.json(about || {});


} catch (error) {
console.error(error);


res.status(500).json({
  message: error.message,
});


}
});

/* UPDATE */
router.put(
"/",
upload.fields([
{ name: "campusImage", maxCount: 1 },
{ name: "principalImage", maxCount: 1 },
]),
async (req, res) => {
try {
const existing = await AboutUs.findOne();


  if (!existing) {
    return res.status(404).json({
      message: "About Us page not found",
    });
  }

  if (req.files?.campusImage?.[0]) {
    const result =
      await cloudinary.uploader.upload(
        req.files.campusImage[0].path,
        {
          folder: "about-us",
        }
      );

    existing.campusImage =
      result.secure_url;
  }

  if (req.files?.principalImage?.[0]) {
    const result =
      await cloudinary.uploader.upload(
        req.files.principalImage[0].path,
        {
          folder: "about-us",
        }
      );

    existing.principalImage =
      result.secure_url;
  }

  Object.keys(req.body).forEach(
    (key) => {
      if (
        req.body[key] !== undefined &&
        req.body[key] !== ""
      ) {
        existing[key] = req.body[key];
      }
    }
  );

  await existing.save();

  res.json(existing);
} catch (error) {
  console.error(error);

  res.status(500).json({
    message: error.message,
  });
}


}
);

/* DELETE ALL */
router.delete("/", async (req, res) => {
try {
await AboutUs.deleteMany({});


res.json({
  message:
    "About Us page deleted successfully",
});


} catch (error) {
console.error(error);


res.status(500).json({
  message: error.message,
});


}
});

export default router;