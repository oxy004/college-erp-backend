import mongoose from "mongoose";

const radiotihschema =
  new mongoose.Schema({

    bannerVideo: {
      type: String,
      default: "",
    },

    programList: [
      {
        type: String,
        default: "",
      },
    ],

  });

const RadioTih = mongoose.model(
  "RadioTih",
  radiotihschema
);

export default RadioTih;