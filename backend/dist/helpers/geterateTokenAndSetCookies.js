"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geterateTokenAndSetCookies = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const geterateTokenAndSetCookies = (req, res, userId) => {
    try {
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "10d",
        });
        res.cookie("foodApp", token, {
            httpOnly: true,
            secure: false,
            maxAge: 864000000, // 1 hour in milliseconds
        });
        return token;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};
exports.geterateTokenAndSetCookies = geterateTokenAndSetCookies;
