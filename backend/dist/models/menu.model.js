"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MenuSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        // required: true,
        enum: ["Appetizers", "MainCourse", "Dessert", "Beverage"],
    },
    availability: {
        type: Boolean,
        default: true,
    },
});
const MenuModel = mongoose_1.default.model("Menu", MenuSchema);
exports.default = MenuModel;
