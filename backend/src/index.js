"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var auth_route_1 = __importDefault(require("./routes/auth.route"));
var menu_route_1 = __importDefault(require("./routes/menu.route"));
var order_route_1 = __importDefault(require("./routes/order.route"));
var connection_1 = __importDefault(require("./db/connection"));
var app = (0, express_1.default)();
dotenv_1.default.config();
var port = process.env.PORT || 3000;
(0, connection_1.default)();

// CORS options with correct origin and credentials handling
var corsOptions = {
    origin: "https://full-stack-task-management-app-ec3e.vercel.app",  // Set to your frontend domain
    credentials: true, // Allow sending of cookies and other credentials
};

app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/auth", auth_route_1.default);
app.use("/menu", menu_route_1.default);
app.use("/order", order_route_1.default);

app.get("/", function (req, res) {
    res.send("Hello, TypeScript with Node.js and Express!");
});

app.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port));
});
