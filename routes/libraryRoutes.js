import express from "express";
import Library from "../models/Library.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/*
==================================================
CREATE LIBRARY (ONLY IF DB EMPTY)
==================================================
*/
router.post(
  "/",
  upload.fields([
    { name: "teacherAvatar", maxCount: 1 },
    { name: "sideImage", maxCount: 1 },
    { name: "pdfFile", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const existingLibrary = await Library.findOne();

      if (existingLibrary) {
        return res.status(400).json({
          success: false,
          message:
            "Library already exists. Use Update instead.",
        });
      }

   const ebookData = req.body.ebooks
  ? JSON.parse(req.body.ebooks)
  : [];

const ebooks = ebookData.map(
  (book, index) => ({
    pdfTitle: book.pdfTitle || "",
    pdfFile:
      req.files?.pdfFile?.[index]
        ?.filename || "",
  })
);
      const library = await Library.create({
        title: req.body.title || "",
        paragraph: req.body.paragraph || "",

        onlineLibrary:
          req.body.onlineLibrary || "",

        readingRoom:
          req.body.readingRoom || "",

        sideImage:
          req.files?.sideImage?.[0]?.filename || "",

        librarian: {
          avatar:
            req.files?.teacherAvatar?.[0]?.filename ||
            "",

          name:
            req.body.teacherName || "",

          designation:
            req.body.designation || "",

          qualification:
            req.body.qualification || "",
        },

        ebooks,
      });

      res.status(201).json({
        success: true,
        message:
          "Library Created Successfully ✅",
        data: library,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  }
);

/*
==================================================
GET SINGLE LIBRARY DOCUMENT
==================================================
*/
router.get("/", async (req, res) => {
  try {
    const library = await Library.findOne();

    res.status(200).json({
      success: true,
      data: library,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Fetch Failed",
      error: error.message,
    });
  }
});

/*
==================================================
UPDATE LIBRARY
==================================================
*/
router.put(
  "/",
  upload.fields([
    { name: "teacherAvatar", maxCount: 1 },
    { name: "sideImage", maxCount: 1 },
    { name: "pdfFile", maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const library = await Library.findOne();

      if (!library) {
        return res.status(404).json({
          success: false,
          message:
            "Library document not found",
        });
      }

      const ebookData = req.body.ebooks
  ? JSON.parse(req.body.ebooks)
  : [];

const ebooks = ebookData.map(
  (book, index) => ({
    pdfTitle: book.pdfTitle || "",
    pdfFile:
      req.files?.pdfFile?.[index]
        ?.filename ||
      library.ebooks?.[index]
        ?.pdfFile ||
      "",
  })
);
      library.title =
        req.body.title || library.title;

      library.paragraph =
        req.body.paragraph ||
        library.paragraph;

      library.onlineLibrary =
        req.body.onlineLibrary ||
        library.onlineLibrary;

      library.readingRoom =
        req.body.readingRoom ||
        library.readingRoom;

      library.sideImage =
        req.files?.sideImage?.[0]?.filename ||
        library.sideImage;

      library.librarian = {
        avatar:
          req.files?.teacherAvatar?.[0]
            ?.filename ||
          library.librarian?.avatar ||
          "",

        name:
          req.body.teacherName ||
          library.librarian?.name ||
          "",

        designation:
          req.body.designation ||
          library.librarian?.designation ||
          "",

        qualification:
          req.body.qualification ||
          library.librarian?.qualification ||
          "",
      };

      library.ebooks = ebooks;

      await library.save();

      res.status(200).json({
        success: true,
        message:
          "Library Updated Successfully ✅",
        data: library,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Update Failed",
        error: error.message,
      });
    }
  }
);

/*
==================================================
DOWNLOAD PDF
==================================================
*/
router.get(
  "/download/:filename",
  (req, res) => {
    const filePath =
      `uploads/${req.params.filename}`;

    res.download(filePath);
  }
);

/*
==================================================
DELETE ALL
==================================================
*/
router.delete("/", async (req, res) => {
  try {
    await Library.deleteMany({});

    res.status(200).json({
      success: true,
      message:
        "Library Deleted Successfully ✅",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete Failed",
      error: error.message,
    });
  }
});

export default router;