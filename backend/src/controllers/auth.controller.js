"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = exports.register = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var user_model_1 = __importDefault(require("../models/user.model"));
var geterateTokenAndSetCookies_1 = require("../helpers/geterateTokenAndSetCookies");
// Register new user
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, lowerusername, isUsernameAlreadyExists, hashedPassword, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, username = _a.username, password = _a.password;
                if (!username || !password) {
                    res
                        .status(400)
                        .json({ error: "Please provide both username and password." });
                    return [2 /*return*/];
                }
                lowerusername = username.toLowerCase();
                return [4 /*yield*/, user_model_1.default.findOne({
                        username: lowerusername,
                    })];
            case 1:
                isUsernameAlreadyExists = _b.sent();
                if (isUsernameAlreadyExists) {
                    res.status(400).json({ error: "Username Already Exists" });
                    return [2 /*return*/];
                }
                if (password.length < 6) {
                    res
                        .status(400)
                        .json({ error: "Password must be more than 6 characters" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, user_model_1.default.create({
                        username: lowerusername,
                        password: hashedPassword,
                        displayName: username,
                    })];
            case 3:
                newUser = _b.sent();
                res.json({ newUser: newUser, success: true }); // Ensure success response
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error("Server error:", error_1); // Server error logging
                res.status(500).json({ error: "Server Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
// Login existing user
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, lowerusername, isUserExists, isPasswordMatch, userId, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, password = _a.password;
                if (!username || !password) {
                    res
                        .status(400)
                        .json({ message: "Please provide both username and password." });
                    return [2 /*return*/];
                }
                lowerusername = username.toLowerCase();
                return [4 /*yield*/, user_model_1.default.findOne({ username: lowerusername })];
            case 1:
                isUserExists = _b.sent();
                if (!isUserExists) {
                    res.status(404).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, isUserExists.password)];
            case 2:
                isPasswordMatch = _b.sent();
                if (!isPasswordMatch) {
                    res.status(404).json({ error: "Password does not match" });
                    return [2 /*return*/];
                }
                userId = isUserExists._id;
                token = (0, geterateTokenAndSetCookies_1.geterateTokenAndSetCookies)(req, res, userId.toString());
                res.json({ isUserExists: isUserExists, token: token, success: true });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error(error_2);
                res.status(500).json({ error: "Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var getMe = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        try {
            user = req.user;
            if (!user) {
                res.status(401).json({ error: "Unauthorized: No token provided" });
                return [2 /*return*/];
            }
            res.json(user);
            return [2 /*return*/];
        }
        catch (error) {
            error;
            res.status(500).json({ error: "Error in GetMe" });
        }
        return [2 /*return*/];
    });
}); };
exports.getMe = getMe;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
