"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var MenuSchema = new mongoose_1.default.Schema({
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
var MenuModel = mongoose_1.default.model("Menu", MenuSchema);
exports.default = MenuModel;
