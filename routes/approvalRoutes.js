import express from "express";
import fs from "fs";
import path from "path";

import Approval from "../models/Approval.js";
import uploadApproval from "../middleware/uploadApproval.js";

const router = express.Router();

//
// CREATE
//
router.post(
  "/",
  uploadApproval.single("logo"),
  async (req, res) => {
    try {
      const approval = await Approval.create({
        title: req.body.title,
        websiteLink: req.body.websiteLink,
        logo: req.file
          ? `/uploads/approvals/${req.file.filename}`
          : "",
      });

      res.status(201).json(approval);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

//
// GET ALL
//
router.get("/", async (req, res) => {
  try {
    const approvals = await Approval.find().sort({
      createdAt: -1,
    });

    res.json(approvals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// GET ONE
//
router.get("/:id", async (req, res) => {
  try {
    const approval = await Approval.findById(
      req.params.id
    );

    if (!approval) {
      return res
        .status(404)
        .json({ message: "Approval not found" });
    }

    res.json(approval);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// UPDATE
//
router.put(
  "/:id",
  uploadApproval.single("logo"),
  async (req, res) => {
    try {
      const approval = await Approval.findById(
        req.params.id
      );

      if (!approval) {
        return res
          .status(404)
          .json({ message: "Approval not found" });
      }

      let logo = approval.logo;

      if (req.file) {
        if (approval.logo) {
          const oldFile = path.join(
            process.cwd(),
            approval.logo.replace("/", "")
          );

          if (fs.existsSync(oldFile)) {
            fs.unlinkSync(oldFile);
          }
        }

        logo = `/uploads/approvals/${req.file.filename}`;
      }

      approval.title =
        req.body.title || approval.title;

      approval.websiteLink =
        req.body.websiteLink ||
        approval.websiteLink;

      approval.logo = logo;

      await approval.save();

      res.json(approval);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

//
// DELETE ONE
//
router.delete("/:id", async (req, res) => {
  try {
    const approval = await Approval.findById(
      req.params.id
    );

    if (!approval) {
      return res
        .status(404)
        .json({ message: "Approval not found" });
    }

    if (approval.logo) {
      const filePath = path.join(
        process.cwd(),
        approval.logo.replace("/", "")
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await approval.deleteOne();

    res.json({
      message: "Approval deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//
// DELETE ALL
//
router.delete("/", async (req, res) => {
  try {
    const approvals = await Approval.find();

    for (const item of approvals) {
      if (item.logo) {
        const filePath = path.join(
          process.cwd(),
          item.logo.replace("/", "")
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Approval.deleteMany();

    res.json({
      message: "All approvals deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;