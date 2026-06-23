import FacultyNote from "../models/FacultyNote.js";
import Faculty from "../models/Faculty.js";
import cloudinary from "../config/cloudinary.js";


// ======================================================
// CREATE FACULTY NOTE
// ======================================================

export const createFacultyNote = async (req, res) => {
  try {
    const {
      program,
      semester,
      subject,
      title,
    } = req.body;

    const faculty = await Faculty.findById(
      req.user.id
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    let pdfUrl = "";

    if (req.file) {
      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: "auto",
            folder: "faculty-notes",
            use_filename: true,
            unique_filename: true,
          }
        );

      pdfUrl = result.secure_url;
    }

    if (!pdfUrl) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const note =
      await FacultyNote.create({
        uploadedBy: faculty._id,
        facultyName:
          faculty.name ||
          faculty.fullName ||
          "Faculty",

        program,
        semester,
        subject,
        title,
        pdfFile: pdfUrl,
      });

    res.status(201).json({
      success: true,
      message:
        "Faculty note uploaded successfully",
      note,
    });
  } catch (error) {
    console.error(
      "CREATE NOTE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL NOTES
// ======================================================

export const getAllFacultyNotes =
  async (req, res) => {
    try {
      const notes =
        await FacultyNote.find().sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: notes.length,
        notes,
      });
    } catch (error) {
      console.error(
        "GET NOTES ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================================
// GET SINGLE NOTE
// ======================================================

export const getFacultyNoteById =
  async (req, res) => {
    try {
      const note =
        await FacultyNote.findById(
          req.params.id
        );

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        });
      }

      res.status(200).json({
        success: true,
        note,
      });
    } catch (error) {
      console.error(
        "GET NOTE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================================
// UPDATE NOTE
// ======================================================

export const updateFacultyNote =
  async (req, res) => {
    try {
      const note =
        await FacultyNote.findById(
          req.params.id
        );

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        });
      }

      if (
        note.uploadedBy.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can update only your own notes",
        });
      }

      const removePdf =
        req.body.removePdf === "true";

      let pdfUrl = note.pdfFile;

      // Remove existing PDF
      if (removePdf) {
        pdfUrl = "";
      }

      // Upload new PDF
      if (req.file) {
        const result =
          await cloudinary.uploader.upload(
            req.file.path,
            {
              resource_type: "auto",
              folder: "faculty-notes",
              use_filename: true,
              unique_filename: true,
            }
          );

        pdfUrl = result.secure_url;
      }

      note.program =
        req.body.program ||
        note.program;

      note.semester =
        req.body.semester ||
        note.semester;

      note.subject =
        req.body.subject ||
        note.subject;

      note.title =
        req.body.title ||
        note.title;

      note.pdfFile = pdfUrl;

      await note.save();

      res.status(200).json({
        success: true,
        message:
          "Faculty note updated successfully",
        note,
      });
    } catch (error) {
      console.error(
        "UPDATE NOTE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================================
// DELETE NOTE
// ======================================================

export const deleteFacultyNote =
  async (req, res) => {
    try {
      const note =
        await FacultyNote.findById(
          req.params.id
        );

      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        });
      }

      if (
        note.uploadedBy.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can delete only your own notes",
        });
      }

      await note.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Faculty note deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE NOTE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================================
// GET MY NOTES
// ======================================================

export const getMyFacultyNotes =
  async (req, res) => {
    try {
      const notes =
        await FacultyNote.find({
          uploadedBy: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: notes.length,
        notes,
      });
    } catch (error) {
      console.error(
        "MY NOTES ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // ======================================================
// STUDENT NOTES
// ======================================================

// export const getStudentNotes =
//   async (req, res) => {
//     try {

//       const notes =
//         await FacultyNote.find({
//           pdfFile: {
//             $ne: "",
//           },
//         }).sort({
//           createdAt: -1,
//         });

//       res.status(200).json({
//         success: true,
//         count: notes.length,
//         notes,
//       });

//     } catch (error) {

//       console.error(
//         "STUDENT NOTES ERROR:",
//         error
//       );

//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });

//     }
//   };

export const getStudentNotes =
  async (req, res) => {
    try {

      console.log("USER:", req.user);

      const notes =
        await FacultyNote.find();

      console.log(
        "NOTES COUNT:",
        notes.length
      );

      res.status(200).json({
        success: true,
        notes,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

// ======================================================
// SEARCH NOTES
// ======================================================

export const searchFacultyNotes =
  async (req, res) => {
    try {
      const {
        keyword,
        program,
        semester,
        subject,
      } = req.query;

      const query = {};

      if (keyword) {
        query.title = {
          $regex: keyword,
          $options: "i",
        };
      }

      if (program) {
        query.program = program;
      }

      if (semester) {
        query.semester = semester;
      }

      if (subject) {
        query.subject = subject;
      }

      const notes =
        await FacultyNote.find(
          query
        ).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: notes.length,
        notes,
      });
    } catch (error) {
      console.error(
        "SEARCH NOTES ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };