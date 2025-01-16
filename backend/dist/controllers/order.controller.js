"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.placeOrder = void 0;
const menu_model_1 = __importDefault(require("../models/menu.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const placeOrder = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(403).json({ error: "User not found" });
            return;
        }
        const items = req.body.items;
        const { totalAmount } = req.body;
        // Check if items from body is array and has at least one element or nor
        if (!Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: "Items are required to place an order" });
            return;
        }
        if (!totalAmount || totalAmount <= 0) {
            res.status(400).json({ message: "Total amount must be greater than 0" });
            return;
        }
        const itemsToBeAdded = [];
        for (const item of items) {
            const { menuItemId, quantity } = item;
            if (!menuItemId || !quantity || quantity <= 0) {
                res.status(400).json({
                    message: "All items should have valid menuItemId and quantity",
                });
                return;
            }
            const menuItem = await menu_model_1.default.findById(menuItemId);
            if (!menuItem) {
                res
                    .status(404)
                    .json({ message: `Menu item with ID ${menuItemId} not found` });
                return;
            }
            itemsToBeAdded.push({ menuItemId, quantity, price: menuItem.price });
        }
        const addedOrder = await order_model_1.default.create({
            userId: user._id,
            items: itemsToBeAdded,
            totalAmount,
        });
        res.json({
            success: true,
            message: "Order placed successfully.",
            order: addedOrder,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.placeOrder = placeOrder;
const getAllOrders = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(403).json({ error: "User not found" });
            return;
        }
        // Fetching all orders and populating the menuItemId with name and price
        const allOrders = await order_model_1.default.find({ userId: user._id }, {
            items: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        })
            .populate("items.menuItemId", "name price") // Populate menuItemId field with name and price
            .exec();
        res.json({ success: true, allOrders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllOrders = getAllOrders;
