
import express from "express";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import nodemailer from "nodemailer";

import Faculty from "../models/Faculty.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly, facultyOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ============================================
// OTP STORE
// ============================================

const otpStore = {};

// ============================================
// REGISTER FACULTY
// ============================================

router.post(
  "/register",

  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      // CHECK EXISTING

      const exists =
        await Faculty.findOne({
          email,
        });

      if (exists) {

        return res.status(400).json({

          message:
            "Faculty already exists",

        });

      }

      // CREATE FACULTY

      const faculty =
        await Faculty.create({

          name,

          email,

          password,

          role: "faculty",

        });

      res.status(201).json({

        message:
          "Faculty registration successful",

        faculty: {

          ...faculty._doc,

          role: "faculty",

        },

      });

    } catch (error) {

      console.log(
        "FACULTY REGISTER ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Registration failed",

      });

    }

  }
);

// ============================================
// FORGOT PASSWORD
// ============================================

router.post(
  "/forgot-password",

  async (req, res) => {

    try {

      const { email } =
        req.body;

      // FIND FACULTY

      const faculty =
        await Faculty.findOne({
          email,
        });

      if (!faculty) {

        return res.status(404).json({

          success: false,

          message:
            "Faculty not found",

        });

      }

      // GENERATE OTP

      const otp =
        Math.floor(
          100000 +
          Math.random() * 900000
        ).toString();

      // SAVE OTP

      otpStore[email] = otp;

      // MAIL TRANSPORTER

      const transporter =
        nodemailer.createTransport({

          service: "gmail",

          auth: {

            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,

          },

        });

      // SEND MAIL

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          "Password Reset OTP",

        html: `
          <h2>Password Reset OTP</h2>
          <h1>${otp}</h1>
        `,

      });

      res.status(200).json({

        success: true,

        message:
          "OTP sent successfully",

      });

    } catch (error) {

      console.log(
        "FORGOT PASSWORD ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to send OTP",

      });

    }

  }
);

// ============================================
// RESET PASSWORD
// ============================================

router.post(
  "/reset-password",

  async (req, res) => {

    try {

      const {
        email,
        otp,
        newPassword,
      } = req.body;

      // OTP VALIDATION

      if (
        otpStore[email] !== otp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid OTP",

        });

      }

      // FIND FACULTY

      const faculty =
        await Faculty.findOne({
          email,
        });

      if (!faculty) {

        return res.status(404).json({

          success: false,

          message:
            "Faculty not found",

        });

      }

      if ( newPassword.length < 6 ) 
        { 
          return res.status(400).json
          ({
            success: false, 
            message: "Password must be at least 6 characters", }); 
          }

      // UPDATE PASSWORD

      faculty.password =
        newPassword;

      await faculty.save();

      // REMOVE OTP

      delete otpStore[email];

      res.status(200).json({

        success: true,

        message:
          "Password reset successful",

      });

    } catch (error) {

      console.log(
        "RESET PASSWORD ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Password reset failed",

      });

    }

  }
);

// ============================================
// LOGIN FACULTY
// ============================================

router.post(
  "/login",

  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      // FIND FACULTY

      const faculty =
        await Faculty.findOne({
          email,
        });

      if (!faculty) {

        return res.status(404).json({

          message:
            "Faculty not found",

        });

      }

      // PASSWORD MATCH

      const match =
        await bcrypt.compare(
          password,
          faculty.password
        );

      if (!match) {

        return res.status(400).json({

          message:
            "Invalid password",

        });

      }

      // TOKEN

      const token =
        jwt.sign(

          {
            id: faculty._id,
            role: "faculty",
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d",
          }

        );

      res.status(200).json({

        token,

        faculty: {

          ...faculty._doc,

          role: "faculty",

        },

      });

    } catch (error) {

      console.log(
        "FACULTY LOGIN ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Login failed",

      });

    }

  }
);

// ============================================
// GET FACULTY PROFILE
// ============================================

router.get(
  "/profile/:id",

  authMiddleware,

  async (req, res) => {

    try {

      const faculty =
        await Faculty.findById(
          req.params.id
        ).select("-password");

      if (!faculty) {

        return res.status(404).json({

          message:
            "Faculty not found",

        });

      }

      res.status(200).json({

        ...faculty._doc,

        role: "faculty",

      });

    } catch (error) {

      console.log(
        "GET PROFILE ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to fetch profile",

      });

    }

  }
);

// ============================================
// UPDATE FACULTY PROFILE
// ============================================

router.put(
  "/update-profile/:id",

  authMiddleware,

  async (req, res) => {

    try {

      const {
        designation,
        department,
        phone,
        photo,
      } = req.body;

      const updatedFaculty =
        await Faculty.findByIdAndUpdate(

          req.params.id,

          {
            designation,
            department,
            phone,
            photo,
          },

          {
            new: true,
          }

        ).select("-password");

      if (!updatedFaculty) {

        return res.status(404).json({

          message:
            "Faculty not found",

        });

      }

      res.status(200).json({

        message:
          "Profile updated successfully",

        faculty: {

          ...updatedFaculty._doc,

          role: "faculty",

        },

      });

    } catch (error) {

      console.log(
        "UPDATE PROFILE ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Profile update failed",

      });

    }

  }
);

// ============================================
// GET ALL FACULTY
// ============================================

router.get(
  "/all",
  authMiddleware,
  adminOnly,

  async (req, res) => {

    try {

      const faculty =
        await Faculty.find()
          .select("-password")
          .sort({
            name: 1,
          });

      res.status(200).json(
        faculty
      );

    } catch (error) {

      console.log(
        "GET FACULTY ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to fetch faculty",

      });

    }

  }
);

export default router;

