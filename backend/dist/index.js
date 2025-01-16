"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const menu_route_1 = __importDefault(require("./routes/menu.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const connection_1 = __importDefault(require("./db/connection"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 3000;
(0, connection_1.default)();
const corsOptions = {
    origin: "http://localhost:5173/",
    credentials: true,
};
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/auth", auth_route_1.default);
app.use("/menu", menu_route_1.default);
app.use("/order", order_route_1.default);
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Node.js and Express!");
});
app.listen(port, () => {
    `Server is running on http://localhost:${port}`;
});
