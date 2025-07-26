import express from "express";
import {
  getInventories,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/inventory.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getInventories);
router.get("/:id", verifyToken, getInventory);
router.post("/", verifyToken, createInventory);
router.put("/:id", verifyToken, updateInventory);
router.delete("/:id", verifyToken, deleteInventory);

export default router;
