"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagModel = exports.shareModel = exports.contentModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let objectId = mongoose_1.default.Types.ObjectId;
let userSchema = new mongoose_1.default.Schema({
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true }
});
let contentSchema = new mongoose_1.default.Schema({
    link: String,
    type: { type: String },
    tag: [{ type: String, ref: "Tags" }],
    user: { type: objectId, ref: "User" },
    title: String
});
let linkShareSchema = new mongoose_1.default.Schema({
    link: String,
    user: { type: objectId, ref: "User" }
});
let tagSchema = new mongoose_1.default.Schema({
    name: String,
    description: String
});
exports.userModel = mongoose_1.default.model("User", userSchema);
exports.contentModel = mongoose_1.default.model("Content", contentSchema);
exports.shareModel = mongoose_1.default.model("Share", linkShareSchema);
exports.tagModel = mongoose_1.default.model("Tags", tagSchema);
