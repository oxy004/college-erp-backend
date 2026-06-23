import PreviousQuestionPaper from "../models/PreviousQuestionPaper.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

// ======================================
// CREATE PAPER
// ======================================

export const createPaper =
  async (req, res) => {
    try {

      let pdfUrl = "";
      let pdfPublicId = "";

      if (req.file) {

       const result =
  await uploadToCloudinary(
    req.file.buffer,
    "previous-question-papers"
  );

        pdfUrl =
          result.secure_url;

        pdfPublicId =
          result.public_id;
      }

      const paper =
        await PreviousQuestionPaper.create(
          {
            title:
              req.body.title,

            program:
              req.body.program,

            semester:
              req.body.semester,

            subject:
              req.body.subject,

            year:
              req.body.year,

            paperType:
              req.body.paperType,

            description:
              req.body.description ||
              "",

            pdfFile:
              pdfUrl,

            pdfPublicId,
          }
        );

      res.status(201).json({
        success: true,
        message:
          "Question paper uploaded successfully",
        paper,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ======================================
// GET ALL PAPERS
// ======================================

export const getAllPapers =
  async (req, res) => {
    try {

      const papers =
        await PreviousQuestionPaper.find()
          .sort({
            year: -1,
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count:
          papers.length,
        papers,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ======================================
// GET SINGLE PAPER
// ======================================

export const getPaperById =
  async (req, res) => {
    try {

      const paper =
        await PreviousQuestionPaper.findById(
          req.params.id
        );

      if (!paper) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Question paper not found",
          });
      }

      res.status(200).json({
        success: true,
        paper,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ======================================
// UPDATE PAPER
// ======================================

export const updatePaper =
  async (req, res) => {
    try {

      const paper =
        await PreviousQuestionPaper.findById(
          req.params.id
        );

      if (!paper) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Question paper not found",
          });
      }

      let pdfUrl =
        paper.pdfFile;

      let pdfPublicId =
        paper.pdfPublicId;

      if (
        req.body
          .pdfRemoved ===
        "true"
      ) {

        if (
          paper.pdfPublicId
        ) {
          await deleteFromCloudinary(
            paper.pdfPublicId
          );
        }

        pdfUrl = "";
        pdfPublicId = "";
      }

      if (req.file) {

        if (
          paper.pdfPublicId
        ) {
          await deleteFromCloudinary(
            paper.pdfPublicId
          );
        }

        const result =
          await uploadToCloudinary(
            req.file.buffer,
            "previous-question-papers",
            "raw"
          );

        pdfUrl =
          result.secure_url;

        pdfPublicId =
          result.public_id;
      }

      const updatedPaper =
        await PreviousQuestionPaper.findByIdAndUpdate(
          req.params.id,
          {
            title:
              req.body.title,

            program:
              req.body.program,

            semester:
              req.body.semester,

            subject:
              req.body.subject,

            year:
              req.body.year,

            paperType:
              req.body.paperType,

            description:
              req.body.description ||
              "",

            pdfFile:
              pdfUrl,

            pdfPublicId,
          },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Question paper updated successfully",
        paper:
          updatedPaper,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ======================================
// DELETE PAPER
// ======================================

export const deletePaper =
  async (req, res) => {
    try {

      const paper =
        await PreviousQuestionPaper.findById(
          req.params.id
        );

      if (!paper) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Question paper not found",
          });
      }

      if (
        paper.pdfPublicId
      ) {
        await deleteFromCloudinary(
          paper.pdfPublicId
        );
      }

      await paper.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Question paper deleted successfully",
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ======================================
// SEARCH PAPERS
// ======================================

export const searchPapers =
  async (req, res) => {
    try {

      const keyword =
        req.query.q ||
        "";

      const papers =
        await PreviousQuestionPaper.find(
          {
            $or: [
              {
                title: {
                  $regex:
                    keyword,
                  $options:
                    "i",
                },
              },
              {
                subject:
                  {
                    $regex:
                      keyword,
                    $options:
                      "i",
                  },
              },
              {
                program:
                  {
                    $regex:
                      keyword,
                    $options:
                      "i",
                  },
              },
            ],
          }
        );

      res.status(200).json({
        success: true,
        count:
          papers.length,
        papers,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

// ======================================
// FILTER PAPERS
// ======================================

export const filterPapers =
  async (req, res) => {
    try {

      const filter =
        {};

      if (
        req.query.program
      ) {
        filter.program =
          req.query.program;
      }

      if (
        req.query.semester
      ) {
        filter.semester =
          req.query.semester;
      }

      if (
        req.query.year
      ) {
        filter.year =
          req.query.year;
      }

      if (
        req.query.paperType
      ) {
        filter.paperType =
          req.query.paperType;
      }

      const papers =
        await PreviousQuestionPaper.find(
          filter
        ).sort({
          year: -1,
        });

      res.status(200).json({
        success: true,
        count:
          papers.length,
        papers,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };