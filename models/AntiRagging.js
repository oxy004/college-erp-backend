import mongoose from "mongoose";

const posterSchema = new mongoose.Schema({
  image: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

const featureSchema = new mongoose.Schema({
  icon: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

const committeeSchema = new mongoose.Schema({
  image: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
});

const antiRaggingSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "",
    },

    heroDescription: {
      type: String,
      default: "",
    },

    heroBackgroundImage: {
      type: String,
      default: "",
    },

    posters: [posterSchema],

    aboutTitle: {
      type: String,
      default: "",
    },

    aboutDescription1: {
      type: String,
      default: "",
    },

    aboutDescription2: {
      type: String,
      default: "",
    },

    features: [featureSchema],

    rules: [
      {
        type: String,
      },
    ],

    committee: [committeeSchema],

    helplineNumber: {
      type: String,
      default: "",
    },

    officialEmail: {
      type: String,
      default: "",
    },

    reportButtonText: {
      type: String,
      default: "Report Incident",
    },

    complaintButtonText: {
      type: String,
      default: "Lodge Complaint",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AntiRagging", antiRaggingSchema);