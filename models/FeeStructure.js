import mongoose from "mongoose";

const semesterFeeSchema = new mongoose.Schema({
  semester: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },
});

const feeStructureSchema = new mongoose.Schema(
  {
    stream: {
      type: String,
      required: true,
      enum: ["BCA", "BBA", "MCA"],
      unique: true,
    },

    duration: {
      type: String,
      required: true,
    },

    admissionFee: {
      type: Number,
      default: 0,
    },

    semesterFees: [semesterFeeSchema],

    totalFee: {
      type: Number,
      default: 0,
    },

    batch: {
      type: String,
      default: "",
    },

   pdfFile: {
  type: String,
  default: "",
},

pdfPublicId: {
  type: String,
  default: "",
},
    notes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "FeeStructure",
  feeStructureSchema
);