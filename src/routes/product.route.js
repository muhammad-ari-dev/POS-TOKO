import express from "express";
import { upload } from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Semua endpoint dilindungi oleh JWT
router.get("/", getAllProducts); // tanpa verifyToken
router.get("/:id", getProductById); // tanpa verifyToken
router.post("/", verifyToken, upload.single("image"), createProduct);
router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
