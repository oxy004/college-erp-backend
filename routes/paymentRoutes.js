import express from "express";

import {
  createOrder,
  verifyPayment,
  getAllPayments,
  getStudentData,
} from "../controllers/paymentController.js";

const router = express.Router();

// CREATE ORDER
router.post(
  "/create-order",
  createOrder
);

// VERIFY PAYMENT
router.post(
  "/verify-payment",
  verifyPayment
);

// GET ALL PAYMENTS
router.get(
  "/all",
  getAllPayments
);

// AUTO RECALL STUDENT DATA
router.get(
  "/student/:studentId",
  getStudentData
);

export default router;