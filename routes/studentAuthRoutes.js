import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import Student from "../models/Student.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


const otpStore = {};



// ============================================
// REGISTER STUDENT
// ============================================

router.post(
  "/register",

  async (req, res) => {
    try {
      console.log(
        "REGISTER BODY:",
        req.body
      );

      const {
        name,
        email,
        password,

        reg,
        roll,

        stream,
        semester,
      } = req.body;

      // ============================================
      // VALIDATION
      // ============================================

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Name, email and password are required",
        });
      }

      // ============================================
      // EMAIL VALIDATION
      // ============================================

      const emailRegex =
        /^\S+@\S+\.\S+$/;

      if (
        !emailRegex.test(email)
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid email format",
        });
      }

      // ============================================
      // PASSWORD VALIDATION
      // ============================================

      if (
        password.length < 6
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Password must be at least 6 characters",
        });
      }

      // ============================================
      // CHECK EXISTING EMAIL
      // ============================================

      const existingStudent =
        await Student.findOne({
          email:
            email
              .trim()
              .toLowerCase(),
        });

      if (existingStudent) {
        return res.status(400).json({
          success: false,

          message:
            "Student already exists with this email",
        });
      }

      // ============================================
      // CHECK EXISTING ROLL
      // ============================================

      if (roll) {
        const existingRoll =
          await Student.findOne({
            roll,
          });

        if (existingRoll) {
          return res.status(400).json({
            success: false,

            message:
              "Roll number already exists",
          });
        }
      }

      // ============================================
      // CHECK EXISTING REG
      // ============================================

      if (reg) {
        const existingReg =
          await Student.findOne({
            reg,
          });

        if (existingReg) {
          return res.status(400).json({
            success: false,

            message:
              "Registration number already exists",
          });
        }
      }

      // ============================================
// GENERATE BATCH
// ============================================

const currentYear =
  new Date().getFullYear();

let batch = "";

if (
  stream?.toUpperCase() === "MCA"
) {

  batch =
    `${currentYear} - ${currentYear + 2}`;

} else {

  batch =
    `${currentYear} - ${currentYear + 4}`;

}

// ============================================
// CREATE STUDENT
// ============================================

const student =
  await Student.create({

    name:
      name.trim(),

    email:
      email
        .trim()
        .toLowerCase(),

    password,

    role: "student",

    reg:
      reg || "",

    roll:
      roll || "",

    stream:
      stream
        ?.trim()
        ?.toUpperCase() || "",

    semester:
      Number(semester) || 1,

    batch,

  });

      // ============================================
      // RESPONSE
      // ============================================

      res.status(201).json({
        success: true,

        message:
          "Student registered successfully",

        student: {
          ...student.toObject(),

          password: undefined,
        },
      });
    } catch (error) {
      console.log(
        "REGISTER ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Registration failed",

        error:
          error.message,
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

      const student =
        await Student.findOne({
          email,
        });

      if (!student) {

        return res.status(404).json({

          success: false,

          message:
            "Student not found",

        });

      }

      // GENERATE OTP

      const otp =
        Math.floor(
          100000 +
          Math.random() * 900000
        ).toString();

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

      // SEND EMAIL

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          "Password Reset OTP",

        html: `
          <h2>Your OTP</h2>
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

      // OTP CHECK

      if (
        otpStore[email] !== otp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid OTP",

        });

      }

      // HASH PASSWORD

      const salt =
        await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          salt
        );

      // UPDATE PASSWORD

      await Student.findOneAndUpdate(

        { email },

        {
          password:
            hashedPassword,
        }

      );

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
// LOGIN
// ============================================

router.post(
  "/login",

  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // ============================================
      // VALIDATION
      // ============================================

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Email and password required",
        });
      }

      // ============================================
      // FIND STUDENT
      // ============================================

      const student =
        await Student.findOne({
          email:
            email
              .trim()
              .toLowerCase(),
        });

      if (!student) {
        return res.status(404).json({
          success: false,

          message:
            "Student not found",
        });
      }

      // ============================================
      // PASSWORD MATCH
      // ============================================

      const match =
        await bcrypt.compare(
          password,
          student.password
        );

      if (!match) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid password",
        });
      }

      // ============================================
      // TOKEN
      // ============================================

      const token =
        jwt.sign(
          {
            id: student._id,

            role:
              student.role,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d",
          }
        );

      // ============================================
      // RESPONSE
      // ============================================

      res.status(200).json({
        success: true,

        token,

        student: {
          ...student.toObject(),

          password: undefined,
        },
      });
    } catch (error) {
      console.log(
        "LOGIN ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Login failed",

        error:
          error.message,
      });
    }
  }
);

// ============================================
// PROFILE
// ============================================

router.get(
  "/profile/:id",

  authMiddleware,

  async (req, res) => {
    try {
      const student =
        await Student.findById(
          req.params.id
        ).select("-password");

      if (!student) {
        return res.status(404).json({
          success: false,

          message:
            "Student not found",
        });
      }

      res.status(200).json({
        success: true,

        student,
      });
    } catch (error) {
      console.log(
        "PROFILE ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Failed to fetch profile",

        error:
          error.message,
      });
    }
  }
);

// ============================================
// UPDATE PROFILE
// ============================================

router.put(
  "/update-profile/:id",

  authMiddleware,

  async (req, res) => {
    try {
      const allowedFields = [
        "name",
        "phone",
        "address",
        "avatar",

        "stream",
        "semester",

        "roll",
        "reg",
      ];

      const updates = {};

      allowedFields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            updates[field] =
              req.body[field];
          }
        }
      );

      // ============================================
      // FORMAT FIELDS
      // ============================================

      if (updates.stream) {
        updates.stream =
          updates.stream.toUpperCase();
      }

      if (updates.semester) {
        updates.semester =
          Number(
            updates.semester
          );
      }

      // ============================================
      // UPDATE
      // ============================================

      const updatedStudent =
        await Student.findByIdAndUpdate(
          req.params.id,

          updates,

          {
            new: true,

            runValidators: true,
          }
        ).select("-password");

      if (!updatedStudent) {
        return res.status(404).json({
          success: false,

          message:
            "Student not found",
        });
      }

      res.status(200).json({
        success: true,

        message:
          "Profile updated successfully",

        student:
          updatedStudent,
      });
    } catch (error) {
      console.log(
        "UPDATE PROFILE ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Update failed",

        error:
          error.message,
      });
    }
  }
);

export default router;