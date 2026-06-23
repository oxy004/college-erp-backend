import mongoose from "mongoose";

const missionSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "AcademicCapIcon",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const visionMissionSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "Vision & Mission",
    },

    heroDescription: {
      type: String,
      default:
        "Guiding principles that shape our academic excellence, innovation, and commitment to society.",
    },

    visionTitle: {
      type: String,
      default: "Our Vision",
    },

    visionDescription: {
      type: String,
      default: "",
    },

    missions: [missionSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("VisionMission", visionMissionSchema);