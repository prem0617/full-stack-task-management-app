import express from "express";
import { getAllOrders, placeOrder } from "../controllers/order.controller";
import { protectRoute } from "../middleware/protectRoute";
const router = express.Router();

router.post("/", protectRoute, placeOrder);
router.get("/all", protectRoute, getAllOrders);

export default router;
