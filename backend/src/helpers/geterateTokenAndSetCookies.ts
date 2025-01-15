import { Response, Request } from "express";
import jwt from "jsonwebtoken";

export const geterateTokenAndSetCookies = (
  req: Request,
  res: Response,
  userId: string
) => {
  try {
    // Generate JWT token

    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });

    res.cookie("foodApp", token, {
      httpOnly: true,
      secure: false,
      maxAge: 864000000, // 1 hour in milliseconds
    });

    return token;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
