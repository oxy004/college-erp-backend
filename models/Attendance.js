import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    stream: String,

    semester: String,

    session: String,

    attendance: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },

        status: {
          type: String,
          enum: ["Present", "Absent"],
          default: "Present",
        },
      },
    ],
  },
  { timestamps: true }
);
attendanceSchema.index(
  {
    date: 1,
    subjectId: 1,
    facultyId: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("Attendance", attendanceSchema);