"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var menu_controller_1 = require("../controllers/menu.controller");
var protectRoute_1 = require("../middleware/protectRoute");
var router = express_1.default.Router();
router.post("/", protectRoute_1.protectRoute, menu_controller_1.addMenu);
router.get("/", protectRoute_1.protectRoute, menu_controller_1.getAllItems);
router.put("/:id", protectRoute_1.protectRoute, menu_controller_1.editItem);
router.delete("/:id", protectRoute_1.protectRoute, menu_controller_1.deleteItem);
exports.default = router;
