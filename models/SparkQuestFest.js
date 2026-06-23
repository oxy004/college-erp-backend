import mongoose from "mongoose";

const sparkSchema = new mongoose.Schema(
  {
    // Hero Section
    heroTitle: {
      type: String,
      default: "SPARK QUEST",
    },

    heroSubtitle: {
      type: String,
      default: "Annual Technical Fest",
    },

    // Event Details
    startDate: Date,
    endDate: Date,
    eventVenue: String,

    // Registration
    registerLink: String,

    // About Section
    About: String,

    whyParticipate: [
  {
    title: String,
    image: String,
  },
],

    // Event Attractions
    hackathons: String,
    roboticsDrones: String,
    gamingArena: String,
    techTalks: String,
  },
  {
    timestamps: true,
  }
);

const SparkQuestFest = mongoose.model(
  "SparkQuestFest",
  sparkSchema
);

export default SparkQuestFest;