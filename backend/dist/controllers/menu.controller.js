"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.editItem = exports.getAllItems = exports.addMenu = void 0;
const menu_model_1 = __importDefault(require("../models/menu.model"));
const addMenu = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        if (!name || !price) {
            res.status(400).json({ error: "Please provide both name and price." });
            return;
        }
        // Add new menu item to database
        const newMenuItem = await menu_model_1.default.create({
            name,
            price,
            category,
        });
        res.json({ message: "Menu item added successfully", newMenuItem });
        return;
    }
    catch (error) {
        error;
        res.status(500).json({ error: "Server error", errorMessage: error });
        return;
    }
};
exports.addMenu = addMenu;
const getAllItems = async (req, res) => {
    try {
        const allItems = await menu_model_1.default.find();
        res.json({ allItems, success: true });
    }
    catch (error) {
        error;
        res.status(500).json({ error: "Server error", errorMessage: error });
        return;
    }
};
exports.getAllItems = getAllItems;
const editItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, availability } = req.body;
        if (!id || !name || !price) {
            res.status(400).json({ error: "Please provide all required fields." });
            return;
        }
        const updatedItem = await menu_model_1.default.findByIdAndUpdate(id, {
            name,
            price,
            category,
            availability,
        }, { new: true });
        if (!updatedItem) {
            res.status(404).json({ error: "Menu item not found." });
            return;
        }
        res.json({ message: "Menu item updated successfully", updatedItem });
        return;
    }
    catch (error) {
        error;
        res.status(500).json({ error: "Server error", errorMessage: error });
    }
};
exports.editItem = editItem;
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Please provide a valid ID." });
            return;
        }
        const deletedItem = await menu_model_1.default.findByIdAndDelete(id);
        res.json({ message: "Menu item deleted successfully", deletedItem });
        return;
    }
    catch (error) {
        error;
        res.status(500).json({ error: "Server error", errorMessage: error });
        return;
    }
};
exports.deleteItem = deleteItem;
