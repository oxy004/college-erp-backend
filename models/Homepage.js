import mongoose from "mongoose";

const homepageSchema =
  new mongoose.Schema(

    {
      address: {
        type: String,
        default: "",
      },

      slides: [
  {
    image: String,

    fileType: {
      type: String,
      enum: ["image", "pdf"],
      default: "image",
    },

    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "",
    },

    buttonLink: {
      type: String,
      default: "",
    },
  },
],
      
      admissionText: {
        type: String,
        default: "Admissions Open "
      },
    },

    { timestamps: true }

  );

const Homepage = mongoose.model(
  "Homepage",
  homepageSchema
);

export default Homepage;