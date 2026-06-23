import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    website: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    logoPublicId: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Recruiter",
  recruiterSchema
);