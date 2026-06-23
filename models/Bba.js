import mongoose from "mongoose";

const bbaSchema = new mongoose.Schema({

  image: String,

  bbaDescription: String,

  objectives: [String],

  valueAddedPrograms: [String],

  jobProspects: [String],

  placementAssistance: String,

  courseDetails: String,

  duration: String,

  eligibility: String,

});

const Bba = mongoose.model(
  "Bba",
  bbaSchema
);

export default Bba;