"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the Order Schema
const orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            menuItemId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Menu",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending",
    },
}, {
    timestamps: true,
});
const OrderModel = mongoose_1.default.model("Order", orderSchema);
exports.default = OrderModel;
