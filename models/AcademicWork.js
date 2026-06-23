import mongoose from "mongoose";

const academicWorkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Industrial Visit",
        "Workshop",
        "Faculty Development Program",
        "Seminar",
        "Internship",
        "Research Activity",
        "Guest Lecture",
        "Hackathon",
        "Training Program",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    activityDate: {
      type: Date,
      required: true,
    },

    organizer: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    participants: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    gallery: [
      {
        type: String,
      },
    ],
    imagePublicId: {
  type: String,
  default: "",
},

galleryPublicIds: [
  {
    type: String,
  },
],

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AcademicWork", academicWorkSchema);