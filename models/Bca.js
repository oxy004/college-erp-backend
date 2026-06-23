import mongoose from "mongoose";

const bcaSchema = new mongoose.Schema({

  image: String,

  bcaDescription: String,

  objectives: [String],

  valueAddedPrograms: [String],

  jobProspects: [String],

  placementAssistance: String,

  courseDetails: String,

  duration: String,

  eligibility: String,

});

const Bca = mongoose.model(
  "Bca",
  bcaSchema
);

export default Bca;