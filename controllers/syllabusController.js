import Syllabus from "../models/Syllabus.js";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// ======================================
// GET ALL SYLLABUS
// ======================================

export const getSyllabus = async (
  req,
  res
) => {
  try {
    const syllabus =
      await Syllabus.find().sort({
        stream: 1,
        semester: 1,
      });

    res.json(syllabus);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// CREATE / UPDATE SYLLABUS
// ======================================

export const createOrUpdateSyllabus =
  async (req, res) => {
    try {
      const {
        stream,
        semester,
        syllabusType,
      } = req.body;

      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "PDF file is required",
          });
      }

      const existing =
        await Syllabus.findOne({
          stream,
          semester,
          syllabusType,
        });

      // Delete old PDF from Cloudinary
      if (
        existing?.publicId
      ) {
        await cloudinary.uploader.destroy(
          existing.publicId,
          {
            resource_type: "raw",
          }
        );
      }

      // Upload new PDF
      const result =
        await uploadToCloudinary(
          req.file.buffer,
          "syllabus"
        );

      const pdfFile =
        result.secure_url;

      const publicId =
        result.public_id;

      const syllabus =
        await Syllabus.findOneAndUpdate(
          {
            stream,
            semester,
            syllabusType,
          },
          {
            stream,
            semester,
            syllabusType,
            pdfFile,
            publicId,
          },
          {
            new: true,
            upsert: true,
          }
        );

      res.status(200).json({
        success: true,
        syllabus,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================
// DELETE SYLLABUS
// ======================================

export const deleteSyllabus =
  async (req, res) => {
    try {
      const syllabus =
        await Syllabus.findById(
          req.params.id
        );

      if (!syllabus) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Syllabus not found",
          });
      }

      // Delete PDF from Cloudinary
      if (
        syllabus.publicId
      ) {
        await cloudinary.uploader.destroy(
          syllabus.publicId,
          {
            resource_type: "raw",
          }
        );
      }

      await syllabus.deleteOne();

      res.json({
        success: true,
        message:
          "Syllabus deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// ======================================
// GET STREAM SYLLABUS
// ======================================

export const getStreamSyllabus =
  async (req, res) => {
    try {
      const { stream } =
        req.params;

      const syllabus =
        await Syllabus.find({
          stream,
        }).sort({
          semester: 1,
        });

      res.json(syllabus);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };