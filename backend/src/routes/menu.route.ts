import express from "express";
import {
  addMenu,
  deleteItem,
  editItem,
  getAllItems,
} from "../controllers/menu.controller";
import { protectRoute } from "../middleware/protectRoute";

const router = express.Router();

router.post("/", protectRoute, addMenu);
router.get("/", protectRoute, getAllItems);
router.put("/:id", protectRoute, editItem);
router.delete("/:id", protectRoute, deleteItem);

export default router;
