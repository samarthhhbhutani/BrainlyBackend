import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = "12341234";

export default function Auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) throw new Error("Token missing");

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.body.userId = decoded.userId;
    req.body.username = decoded.username;

    next();
  } catch (err) {
    console.error("JWT Auth error:", err);
    console.log("User not signed in");
    res.status(403).json({ message: "User not signed in" });
  }
}
