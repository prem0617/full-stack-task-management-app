"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const geterateTokenAndSetCookies_1 = require("../helpers/geterateTokenAndSetCookies");
// Register new user
const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res
                .status(400)
                .json({ error: "Please provide both username and password." });
            return;
        }
        const lowerusername = username.toLowerCase();
        const isUsernameAlreadyExists = await user_model_1.default.findOne({
            username: lowerusername,
        });
        if (isUsernameAlreadyExists) {
            res.status(400).json({ error: "Username Already Exists" });
            return;
        }
        if (password.length < 6) {
            res
                .status(400)
                .json({ error: "Password must be more than 6 characters" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await user_model_1.default.create({
            username: lowerusername,
            password: hashedPassword,
            displayName: username,
        });
        res.json({ newUser, success: true }); // Ensure success response
    }
    catch (error) {
        console.error("Server error:", error); // Server error logging
        res.status(500).json({ error: "Server Error" });
    }
};
exports.register = register;
// Login existing user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res
                .status(400)
                .json({ message: "Please provide both username and password." });
            return;
        }
        const lowerusername = username.toLowerCase();
        const isUserExists = await user_model_1.default.findOne({ username: lowerusername });
        if (!isUserExists) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const isPasswordMatch = await bcrypt_1.default.compare(password, isUserExists.password);
        if (!isPasswordMatch) {
            res.status(404).json({ error: "Password does not match" });
            return;
        }
        const userId = isUserExists._id;
        const token = (0, geterateTokenAndSetCookies_1.geterateTokenAndSetCookies)(req, res, userId.toString());
        res.json({ isUserExists, token, success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: "Unauthorized: No token provided" });
            return;
        }
        res.json(user);
        return;
    }
    catch (error) {
        error;
        res.status(500).json({ error: "Error in GetMe" });
    }
};
exports.getMe = getMe;
const logout = async (req, res) => {
    try {
        res.clearCookie("foodApp", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error while logging out" });
    }
};
exports.logout = logout;
