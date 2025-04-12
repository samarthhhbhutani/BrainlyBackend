"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Auth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "12341234";
function Auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token)
            throw new Error("Token missing");
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.body.userId = decoded.userId;
        req.body.username = decoded.username;
        next();
    }
    catch (err) {
        console.error("JWT Auth error:", err);
        console.log("User not signed in");
        res.status(403).json({ message: "User not signed in" });
    }
}
