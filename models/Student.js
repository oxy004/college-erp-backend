
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
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

    role: {
      type: String,
      default: "student",
    },

    roll: {
      type: String,
      unique: true,
      sparse: true,
      default: "",
    },

    reg: {
      type: String,
      unique: true,
      sparse: true,
      default: "",
    },

    stream: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    semester: {
      type: Number,
      default: 1,
    },
  status: {
  type: String,
  enum: [
    "active",
    "passout",
    "suspended",
  ],
  default: "active",
},

batch: {
  type: String,
  default: "",
},

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

// ============================================
// HASH PASSWORD
// ============================================

studentSchema.pre(
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

const Student =
  mongoose.models.Student ||
  mongoose.model(
    "Student",
    studentSchema
  );

export default Student;

