import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/user.model";

interface JwtPayload {
  userId: string;
  // Add more fields if your token contains other data
}

declare module "express" {
  interface Request {
    user?: {
      _id: string;
      username: string;
      displayName: string;
    };
  }
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.foodApp;
    //  (token, " : token");

    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    // Verify the token
    const isVerified = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    //  (isVerified, " : verified");

    const userId = isVerified.userId;

    const user = await UserModel.findById(userId, "username");

    if (!user) res.json({ error: "User not found" });

    req.user = {
      _id: user!._id.toString(),
      username: user!.username,
      displayName: user!.displayName!,
    };

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};
