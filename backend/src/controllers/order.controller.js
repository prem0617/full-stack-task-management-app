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
exports.getAllOrders = exports.placeOrder = void 0;
var menu_model_1 = __importDefault(require("../models/menu.model"));
var order_model_1 = __importDefault(require("../models/order.model"));
var placeOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, items, totalAmount, itemsToBeAdded, _i, items_1, item, menuItemId, quantity, menuItem, addedOrder, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                user = req.user;
                if (!user) {
                    res.status(403).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                items = req.body.items;
                totalAmount = req.body.totalAmount;
                // Check if items from body is array and has at least one element or nor
                if (!Array.isArray(items) || items.length === 0) {
                    res.status(400).json({ message: "Items are required to place an order" });
                    return [2 /*return*/];
                }
                if (!totalAmount || totalAmount <= 0) {
                    res.status(400).json({ message: "Total amount must be greater than 0" });
                    return [2 /*return*/];
                }
                itemsToBeAdded = [];
                _i = 0, items_1 = items;
                _a.label = 1;
            case 1:
                if (!(_i < items_1.length)) return [3 /*break*/, 4];
                item = items_1[_i];
                menuItemId = item.menuItemId, quantity = item.quantity;
                if (!menuItemId || !quantity || quantity <= 0) {
                    res.status(400).json({
                        message: "All items should have valid menuItemId and quantity",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, menu_model_1.default.findById(menuItemId)];
            case 2:
                menuItem = _a.sent();
                if (!menuItem) {
                    res
                        .status(404)
                        .json({ message: "Menu item with ID ".concat(menuItemId, " not found") });
                    return [2 /*return*/];
                }
                itemsToBeAdded.push({ menuItemId: menuItemId, quantity: quantity, price: menuItem.price });
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [4 /*yield*/, order_model_1.default.create({
                    userId: user._id,
                    items: itemsToBeAdded,
                    totalAmount: totalAmount,
                })];
            case 5:
                addedOrder = _a.sent();
                res.json({
                    success: true,
                    message: "Order placed successfully.",
                    order: addedOrder,
                });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).json({ error: "Server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.placeOrder = placeOrder;
var getAllOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, allOrders, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                if (!user) {
                    res.status(403).json({ error: "User not found" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, order_model_1.default.find({ userId: user._id }, {
                        items: true,
                        totalAmount: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                    })
                        .populate("items.menuItemId", "name price") // Populate menuItemId field with name and price
                        .exec()];
            case 1:
                allOrders = _a.sent();
                res.json({ success: true, allOrders: allOrders });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                res.status(500).json({ error: "Server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllOrders = getAllOrders;
