"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndSetCookies = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateTokenAndSetCookies = function (req, res, userId) {
    try {
        // Generate JWT token
        var token = jsonwebtoken_1.default.sign({ userId: userId }, process.env.JWT_SECRET, {
            expiresIn: "10d", // Expiry set for 10 days
        });

        // Determine if in production or development environment
        var isProduction = process.env.NODE_ENV === "production";

        res.cookie("foodApp", token, {
            httpOnly: true,
            secure: isProduction,  // Set to true if in production (HTTPS required)
            sameSite: isProduction ? 'None' : 'Lax', // Cross-origin cookie handling
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
        });

        return token;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};
exports.generateTokenAndSetCookies = generateTokenAndSetCookies;
