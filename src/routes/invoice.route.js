import express from "express";
import {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  getInvoiceByEmail,
} from "../controllers/invoice.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Semua route dilindungi JWT
router.post("/", verifyToken, createInvoice);

// ✅ Lebih spesifik dulu
router.get("/email/:email", verifyToken, getInvoiceByEmail);

// ✅ Baru yang umum
router.get("/", verifyToken, getAllInvoices);
router.get("/:id", verifyToken, getInvoiceById);

export default router;
