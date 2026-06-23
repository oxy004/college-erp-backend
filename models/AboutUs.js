import mongoose from "mongoose";


const aboutUsSchema = new mongoose.Schema(
{
heroTitle: {
type: String,
default: "",
},

heroDescription: {
type: String,
default: "",
},

campusImage: {
type: String,
default: "",
},

campusTitle: {
type: String,
default: "",
},

campusDescription1: {
type: String,
default: "",
},

campusDescription2: {
type: String,
default: "",
},

visionTitle: {
type: String,
default: "",
},

visionDescription1: {
type: String,
default: "",
},

visionDescription2: {
type: String,
default: "",
},

principalImage: {
type: String,
default: "",
},

principalName: {
type: String,
default: "",
},

principalDesignation: {
type: String,
default: "",
},

principalQuote: {
type: String,
default: "",
},

principalMessage: {
type: String,
default: "",
},

closingMessage: {
type: String,
default: "",
},

yearsOfExcellence: {
  type: String,
  default: "",
},

studentsEducated: {
  type: String,
  default: "",
},

facultyMembers: {
  type: String,
  default: "",
},

placementSupport: {
  type: String,
  default: "",
}
},
{
timestamps: true,
}
);

export default mongoose.model("AboutUs", aboutUsSchema);
