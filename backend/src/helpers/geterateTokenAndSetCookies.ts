import { Response, Request } from "express";
import jwt from "jsonwebtoken";

// Corrected function name
export const generateTokenAndSetCookies = (
  req: Request,
  res: Response,
  userId: string
) => {
  try {
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: "10d", // Expiry set for 10 days
    });

    // Determine if in production or development environment
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("foodApp", token, {
      httpOnly: true,
      secure: isProduction,  // Set to true if in production (HTTPS required)
      sameSite: isProduction ? 'none' : 'lax', // Cross-origin cookie handling
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
    });

    return token;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

