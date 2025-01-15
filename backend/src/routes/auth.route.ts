import express, { Router } from "express";
import { getMe, login, logout, register } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/protectRoute";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getMe", protectRoute, getMe);
router.get("/logout", protectRoute, logout);

export default router;
