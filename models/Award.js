import mongoose from "mongoose";

const awardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    recipient: {
      type: String,
      required: true,
      trim: true,
    },

    awardee: {
      type: String,
      required: true,
      trim: true,
    },

    awardDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Award", awardSchema);