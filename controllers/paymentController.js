import dotenv from "dotenv";

dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";

import Payment from "../models/Payment.js";

// RAZORPAY INSTANCE
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_SECRET,
});

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const {
      studentName,
      studentId,
      email,
      phone,
      stream,
      semester,
      paymentPurpose,
      amount,
    } = req.body;

    const options = {
      amount: Number(amount) * 100,

      currency: "INR",

      receipt: `receipt_${Date.now()}`,
    };

    // CREATE RAZORPAY ORDER
    const order = await razorpay.orders.create(options);

    // SAVE PAYMENT IN DATABASE
    const payment = new Payment({
      studentName,
      studentId,
      email,
      phone,
      stream,
      semester,
      paymentPurpose,
      amount,

      razorpayOrderId: order.id,

      receiptNumber: options.receipt,

      paymentStatus: "Pending",
    });

    await payment.save();

    res.status(200).json({
      success: true,

      order,

      amount: options.amount,

      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // GENERATE SIGNATURE
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET
      )

      .update(
        razorpay_order_id +
          "|" +
          razorpay_payment_id
      )

      .digest("hex");

    // VERIFY SIGNATURE
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,

        message: "Payment Verification Failed",
      });
    }

    // UPDATE PAYMENT
    const payment = await Payment.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
      },

      {
        razorpayPaymentId: razorpay_payment_id,

        razorpaySignature: razorpay_signature,

        transactionId: razorpay_payment_id,

        paymentMethod: "Razorpay",

        paymentStatus: "Success",
      },

      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,

      payment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Verification Failed",
    });
  }
};

// GET ALL PAYMENTS
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      payments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
};

// GET STUDENT DATA
export const getStudentData = async (req, res) => {
  try {
    const student = await Payment.findOne({
      studentId: req.params.studentId,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
      });
    }

    res.status(200).json({
      success: true,

      student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
};