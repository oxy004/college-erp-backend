import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import { fileURLToPath } from "url";

// ============================================
// CMS ROUTES
// ============================================

import homepageRoutes from "./routes/homepageRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";

import bbaRoutes from "./routes/bbaRoutes.js";
import bcaRoutes from "./routes/bcaRoutes.js";
import mcaRoutes from "./routes/mcaRoutes.js";

import cetRoutes from "./routes/cetRoutes.js";
import jecaRoutes from "./routes/jecaRoutes.js";

import radioRoutes from "./routes/radioRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";

import admissionRoutes from "./routes/admissionRoutes.js";

import admissionProcedureRoutes from "./routes/admissionProcedureRoutes.js";

import libraryRoutes from "./routes/libraryRoutes.js";

import videogalleryRoutes from "./routes/videogalleryRoutes.js";

import webmagazineRoutes from "./routes/webmagazineRoutes.js";

import computerlabRoutes from "./routes/computerlabRoutes.js";

import aboutUsRoutes from "./routes/aboutUsRoutes.js";

import antiRaggingRoutes from "./routes/antiRaggingRoutes.js";

import visionMissionRoutes from "./routes/visionMissionRoutes.js";

import contactRoutes from "./routes/contactRoutes.js";

import noticeRoutes from "./routes/noticeRoutes.js";

import previousQuestionRoutes from "./routes/previousQuestionRoutes.js";

import facultyNoteRoutes from "./routes/facultyNoteRoutes.js";

import recruiterRoutes from "./routes/recruiterRoutes.js";
import placedStudentRoutes from "./routes/placedStudentRoutes.js";

import calendarRoutes from "./routes/calendarRoutes.js";

import holidayRoutes from "./routes/holidayRoutes.js";

import sparkRoutes from "./routes/sparkRoutes.js"

import verbenaRoutes from "./routes/verbenaRoutes.js";

import approvalRoutes from "./routes/approvalRoutes.js";

import subjectRoutes from "./routes/subjectRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";

import commonRoomRoutes from "./routes/commonRoomRoutes.js"

import syllabusRoutes
from "./routes/syllabusRoutes.js";

import feeStructureRoutes from "./routes/feeStructureRoutes.js";

import photoGalleryRoutes from "./routes/photoGalleryRoutes.js";

import facultyResearchRoutes from "./routes/facultyResearchRoutes.js";

import awardRoutes from "./routes/awardRoutes.js";

import annualSportsMeetRoutes from "./routes/annualSportsMeetRoutes.js";

import academicWorkRoutes from "./routes/academicWorkRoutes.js";


// ============================================
// AUTH ROUTES
// ============================================

import facultyAuthRoutes from "./routes/facultyAuthRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// ============================================
// CONFIG
// ============================================

dotenv.config();

const app = express();

// ============================================
// FIX __dirname FOR ES MODULES
// ============================================

const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);



// ============================================
// STATIC FOLDER
// ============================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

// ============================================
// AUTH ROUTES
// ============================================

// FACULTY
app.use(
  "/api/faculty",
  facultyAuthRoutes
);

// STUDENT
app.use(
  "/api/student",
  studentAuthRoutes
);

// ADMIN
app.use(
  "/api/admin",
  adminAuthRoutes
);

// ============================================
// CMS ROUTES
// ============================================

app.use(
  "/api/homepage",
  homepageRoutes
);

app.use(
  "/api/programs",
  programRoutes
);

app.use(
  "/api/testimonials",
  testimonialRoutes
);

app.use(
  "/api/bba",
  bbaRoutes
);

app.use(
  "/api/bca",
  bcaRoutes
);

app.use(
  "/api/mca",
  mcaRoutes
);

app.use(
  "/api/cet",
  cetRoutes
);

app.use(
  "/api/jeca",
  jecaRoutes
);

app.use(
  "/api/radio-tih",
  radioRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use("/api/admissions", admissionRoutes);

app.use(
  "/api/admission-procedure",
  admissionProcedureRoutes
);

app.use(
  "/api/library",
  libraryRoutes
);

app.use(
  "/api/computer-laboratory",
  computerlabRoutes
);

app.use(
  "/api/web-magazine",
  webmagazineRoutes
);

app.use(
  "/api/videogallery",
  videogalleryRoutes
);

app.use("/api/about-us", aboutUsRoutes);

app.use("/api/anti-ragging", antiRaggingRoutes);

app.use("/api/vision-mission", visionMissionRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/notices", noticeRoutes);

app.use(
  "/api/previous-papers",
  previousQuestionRoutes
);

app.use(
  "/api/faculty-notes",
  facultyNoteRoutes
);

app.use("/api/recruiters", recruiterRoutes);
app.use("/api/placed-students", placedStudentRoutes);

app.use("/api/calendar", calendarRoutes);

app.use("/api/holidays", holidayRoutes);

app.use("/api/spark", sparkRoutes);

app.use("/api/verbena", verbenaRoutes);

app.use("/api/approvals", approvalRoutes);

app.use(
  "/api/admin/students",
  adminStudentRoutes
);

app.use(
  "/api/subjects",
  subjectRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/assignments",
  assignmentRoutes
);

app.use("/api/journal", journalRoutes);

app.use("/api/common-room", commonRoomRoutes);

app.use(
  "/api/syllabus",
  syllabusRoutes
);

app.use(
  "/api/fee-structure",
  feeStructureRoutes
);

app.use(
  "/api/photo-gallery",
  photoGalleryRoutes
);

app.use(
  "/api/faculty-research",
  facultyResearchRoutes
);

app.use("/api/awards", awardRoutes);


app.use(
  "/api/annual-sports-meet",
  annualSportsMeetRoutes
);

app.use(
  "/api/academic-works",
  academicWorkRoutes
);

// ============================================
// TEST ROUTE
// ============================================

app.get(
  "/",

  (req, res) => {
    res.send(
      "Backend Running ✅"
    );
  }
);

// ============================================
// DATABASE CONNECTION
// ============================================

mongoose
  .connect(
    process.env.MONGO_URI
  )

  .then(() => {
    console.log(
      "MongoDB Connected ✅"
    );

    app.listen(
      process.env.PORT || 5000,

      () => {
        console.log(
          `Server running on ${
            process.env.PORT || 5000
          }`
        );
      }
    );
  })

  .catch((err) => {
    console.log(
      "MongoDB Error:",
      err
    );
  });