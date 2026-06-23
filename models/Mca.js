import mongoose from "mongoose";

const mcaSchema = new mongoose.Schema({

  image: String,

  mcaDescription: String,

  objectives: [String],

  valueAddedPrograms: [String],

  jobProspects: [String],

  placementAssistance: String,

  courseDetails: String,

  duration: String,

  eligibility: String,

});

const Mca = mongoose.model(
  "Mca",
  mcaSchema
);

export default Mca;