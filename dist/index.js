"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const app = (0, express_1.default)();
const db_1 = require("./db");
const middlewares_1 = __importDefault(require("./middlewares"));
const JWT_SECRET = "12341234";
const cors_1 = __importDefault(require("cors"));
mongoose_1.default.connect("mongodb+srv://samarthhbhutani:Samarth123@cluster0.4yqnw.mongodb.net/brainly");
const passport_1 = __importDefault(require("passport"));
require("./passport.js");
const usernameSchema = zod_1.z.string().min(3).max(10);
const passwordSchema = zod_1.z.string().min(8).max(20);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let username = req.body.username;
        let password = req.body.password;
        console.log(username);
        console.log(password);
        try {
            usernameSchema.parse(username);
            passwordSchema.parse(password);
        }
        catch (_a) {
            res.status(411).json({
                message: "Error in Inputs"
            });
            return;
        }
        try {
            yield db_1.userModel.create({
                username: username,
                password: password
            });
            res.status(200).json({
                message: "User Added"
            });
        }
        catch (e) {
            res.status(403).json({
                message: e
            });
        }
    });
});
app.post("/api/v1/signin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let username = req.body.username;
        let password = req.body.password;
        const user = yield db_1.userModel.findOne({ username: username, password: password });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET);
            res.status(200).json({
                token: token
            });
        }
        else {
            res.status(403).json({
                message: "Wrong email password"
            });
        }
    });
});
app.post("/api/v1/content", middlewares_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Post content");
        const userId = req.body.userId;
        const link = req.body.link;
        const type = req.body.type;
        const title = req.body.title;
        console.log(userId, link, type);
        yield db_1.contentModel.create({
            link: link,
            type: type,
            user: userId,
            title: title
        });
        res.json({ message: "Post created" });
    });
});
app.get("/api/v1/content", middlewares_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Get content");
        const userId = req.body.userId;
        const posts = yield db_1.contentModel.find({
            user: userId
        });
        res.status(200).json({
            content: posts
        });
    });
});
app.post("/api/v1/content/media", middlewares_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Get content media");
        const userId = req.body.userId;
        const type = req.body.type;
        const posts = yield db_1.contentModel.find({
            user: userId,
            type: type
        });
        res.status(200).json({
            content: posts
        });
    });
});
app.delete("/api/v1/content", middlewares_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId;
        const contentId = req.body.contentId;
        yield db_1.contentModel.deleteMany({ user: userId, _id: contentId });
        res.json({ message: "Content deleted" });
    });
});
app.post("/api/v1/brain/share", middlewares_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Share content");
        const userId = req.body.userId;
        console.log("HERE: ", userId);
        yield db_1.shareModel.create({ link: userId, user: userId });
        res.json({
            link: userId
        });
    });
});
app.get('/api/v1/checkUser', middlewares_1.default, function (req, res) {
    res.status(200).json({
        message: "User is signed in"
    });
});
app.delete("/api/v1/brain/share", middlewares_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId;
        yield db_1.shareModel.deleteOne({ user: userId });
        res.status(201).json({
            message: "Share link deleted"
        });
    });
});
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", { session: false, failureRedirect: "/login" }), (req, res) => {
    console.log("INSIDE");
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ userId: user.userId, username: user.username }, JWT_SECRET, { expiresIn: "1d" });
    // 🟢 Option 1: Redirect to frontend with token
    // res.redirect(`http://localhost:3000?token=${token}`);
    // 🔵 Option 2: Send JWT in response (JSON)
    res.redirect("http://localhost:5173/dashboard?token=" + token);
});
app.get("/api/v1/brain/checkShare", middlewares_1.default, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId;
        try {
            const user = yield db_1.shareModel.findOne({ user: userId });
            res.status(200).json({
                message: "Share link exists"
            });
        }
        catch (e) {
            res.status(403).json({
                message: "No share link"
            });
        }
    });
});
app.get("/api/v1/brain/:shareLink", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = req.params.shareLink;
        const user = yield db_1.shareModel.findOne({ link: link });
        if (user) {
            console.log("ShareLink ", user);
            const posts = yield db_1.contentModel.find({ user: user.user });
            const userdets = yield db_1.userModel.findOne({ _id: user.user });
            res.json({
                content: posts,
                user: userdets === null || userdets === void 0 ? void 0 : userdets.username
            });
        }
        else {
            res.status(403).json({
                message: "Incorrect share link"
            });
        }
    });
});
app.listen(3000);
