import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const categorySchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});


const verbenaSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "VERBENA 2026",
    },

    heroSubtitle: {
      type: String,
      default: "Where Culture Meets Creativity",
    },

    startDate: String,
    endDate: String,

    venue: String,

    registerLink: String,

    heroImage: String,

    aboutTitle: {
      type: String,
      default: "About Verbena",
    },

    aboutDescription: String,

    aboutImage: String,

    eventCategories: [categorySchema],

    whyParticipate: [highlightSchema],

    timeline: [
      {
        day: String,
        title: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Verbena", verbenaSchema);