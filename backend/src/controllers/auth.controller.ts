import bcrypt from "bcrypt";

import { Response, Request } from "express";
import UserModel from "../models/user.model";
import { geterateTokenAndSetCookies } from "../helpers/geterateTokenAndSetCookies";

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res
        .status(400)
        .json({ error: "Please provide both username and password." });
      return;
    }

    const lowerusername = username.toLowerCase();
    const isUsernameAlreadyExists = await UserModel.findOne({
      username: lowerusername,
    });

    if (isUsernameAlreadyExists) {
      res.status(400).json({ error: "Username Already Exists" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be more than 6 characters" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username: lowerusername,
      password: hashedPassword,
      displayName: username,
    });

    res.json({ newUser, success: true }); // Ensure success response
  } catch (error) {
    console.error("Server error:", error); // Server error logging
    res.status(500).json({ error: "Server Error" });
  }
};

// Login existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res
        .status(400)
        .json({ message: "Please provide both username and password." });
      return;
    }

    const lowerusername = username.toLowerCase();
    const isUserExists = await UserModel.findOne({ username: lowerusername });

    if (!isUserExists) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      isUserExists.password
    );

    if (!isPasswordMatch) {
      res.status(404).json({ error: "Password does not match" });
      return;
    }

    const userId = isUserExists._id;

    const token = geterateTokenAndSetCookies(req, res, userId.toString());

    res.json({ isUserExists, token, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    error;
    res.status(500).json({ error: "Error in GetMe" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("foodApp", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error while logging out" });
  }
};
