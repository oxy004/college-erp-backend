import mongoose from "mongoose";

const alumniTalkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const videoGallerySchema = new mongoose.Schema(
  {
    bannerVideo: {
      type: String,
      default: "",
    },

    promoVideo: {
      type: String,
      default: "",
    },

    paragraph: {
      type: String,
      default: "",
    },

    alumniTalks: {
      type: [alumniTalkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("VideoGallery", videoGallerySchema);