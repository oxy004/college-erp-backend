import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    studentName: String,

    studentId: String,

    email: String,

    phone: String,

    stream: String,

    semester: String,

    paymentPurpose: String,

    amount: Number,

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    transactionId: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },

    receiptNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;