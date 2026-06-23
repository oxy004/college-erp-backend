import FeeStructure from "../models/FeeStructure.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/uploadToCloudinary.js";

export const createOrUpdateFeeStructure =
  async (req, res) => {
    try {

      console.log("===========");
      console.log("BODY");
      console.log(req.body);

      console.log("FILE");
      console.log(req.file);

      const {
        stream,
        duration,
        admissionFee,
        semesterFees,
        batch,
        notes,
      } = req.body;

      const parsedFees =
        typeof semesterFees ===
        "string"
          ? JSON.parse(
              semesterFees
            )
          : semesterFees || [];

      if (
        !parsedFees.length
      ) {
        return res
          .status(400)
          .json({
            message:
              "At least one semester fee is required",
          });
      }

      if (
        parsedFees.some(
          (item) =>
            !item.amount ||
            Number(
              item.amount
            ) <= 0
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "All semester fee amounts are required",
          });
      }

      const parsedNotes =
        typeof notes ===
        "string"
          ? JSON.parse(notes)
          : notes;

      console.log(
        "PARSED FEES"
      );
      console.log(
        parsedFees
      );

      console.log(
        "PARSED NOTES"
      );
      console.log(
        parsedNotes
      );

      const totalFee =
        Number(
          admissionFee
        ) +
        parsedFees.reduce(
          (sum, item) =>
            sum +
            Number(
              item.amount
            ),
          0
        );

      let fee =
        await FeeStructure.findOne(
          {
            stream,
          }
        );

      if (!fee) {
        fee =
          new FeeStructure(
            {
              stream,
            }
          );
      }

      fee.duration =
        duration;

      fee.admissionFee =
        admissionFee;

      fee.semesterFees =
        parsedFees;

      fee.batch = batch;

      fee.notes =
        parsedNotes || [];

      fee.totalFee =
        totalFee;

      if (req.file) {

        if (
          fee.pdfPublicId
        ) {
          await deleteFromCloudinary(
            fee.pdfPublicId
          );
        }

        const result =
          await uploadToCloudinary(
            req.file.buffer,
            "fee-structure",
            "raw"
          );

        fee.pdfFile =
          result.secure_url;

        fee.pdfPublicId =
          result.public_id;
      }

      await fee.save();

      res.json({
        success: true,
        fee,
      });

    } catch (error) {

      console.error(
        "FEE STRUCTURE ERROR:"
      );

      console.error(
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const getFeeStructures =
  async (
    req,
    res
  ) => {
    try {

      const data =
        await FeeStructure.find()
          .sort({
            stream: 1,
          });

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

export const getFeeStructureByStream =
  async (
    req,
    res
  ) => {
    try {

      const fee =
        await FeeStructure.findOne(
          {
            stream:
              req.params
                .stream,
          }
        );

      if (!fee) {
        return res
          .status(404)
          .json({
            message:
              "Fee structure not found",
          });
      }

      res.json(fee);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };

export const deleteFeeStructure =
  async (
    req,
    res
  ) => {
    try {

      const fee =
        await FeeStructure.findById(
          req.params.id
        );

      if (!fee) {
        return res
          .status(404)
          .json({
            message:
              "Fee structure not found",
          });
      }

      if (
        fee.pdfPublicId
      ) {
        await deleteFromCloudinary(
          fee.pdfPublicId
        );
      }

      await FeeStructure.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
      });

    } catch (error) {

      console.error(
        "DELETE FEE STRUCTURE ERROR:"
      );

      console.error(
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };