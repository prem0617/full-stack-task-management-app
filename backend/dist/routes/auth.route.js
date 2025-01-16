"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const protectRoute_1 = require("../middleware/protectRoute");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/getMe", protectRoute_1.protectRoute, auth_controller_1.getMe);
router.get("/logout", protectRoute_1.protectRoute, auth_controller_1.logout);
exports.default = router;
