
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    designation: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "faculty",
    },
  },

  {
    timestamps: true,
  }
);

// ============================================
// HASH PASSWORD
// ============================================

facultySchema.pre(
  "save",

  async function () {

    if (
      !this.isModified(
        "password"
      )
    ) {
      return;
    }

    const salt =
      await bcrypt.genSalt(10);

    this.password =
      await bcrypt.hash(
        this.password,
        salt
      );

  }
);

// ============================================
// EXPORT MODEL
// ============================================

const Faculty =
  mongoose.models.Faculty ||
  mongoose.model(
    "Faculty",
    facultySchema
  );

export default Faculty;

