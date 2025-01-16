import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import auth from "./routes/auth.route";
import menu from "./routes/menu.route";
import order from "./routes/order.route";

import connectDB from "./db/connection";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

connectDB();

const corsOptions = {
  origin: "https://full-stack-task-management-app-zlja.onrender.com/",
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", auth);
app.use("/menu", menu);
app.use("/order", order);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node.js and Express!");
});

app.listen(port, () => {
  `Server is running on http://localhost:${port}`;
});
