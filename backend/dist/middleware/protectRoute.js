"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.foodApp;
        //  (token, " : token");
        if (!token) {
            res.status(401).json({ error: "Unauthorized: No token provided" });
            return;
        }
        // Verify the token
        const isVerified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        //  (isVerified, " : verified");
        const userId = isVerified.userId;
        const user = await user_model_1.default.findById(userId, "username");
        if (!user)
            res.json({ error: "User not found" });
        req.user = {
            _id: user._id.toString(),
            username: user.username,
            displayName: user.displayName,
        };
        next();
    }
    catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
        return;
    }
};
exports.protectRoute = protectRoute;
