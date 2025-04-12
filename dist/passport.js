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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db_1 = require("./db");
const JWT_SECRET = "12341234";
// --- Passport Google Strategy ---
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: "216339164300-laaqe6dag4qn0djcmkqsr02rf6lfq9tp.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        userId: profile.id,
        username: profile.displayName,
    };
    const existinguser = yield db_1.userModel.findOne({ username: profile.displayName });
    if (existinguser) {
        console.log("User already exists in DB", existinguser);
        return done(null, existinguser);
    }
    else {
        const user = yield db_1.userModel.create({
            username: profile.displayName,
            googleId: profile.id
        });
        return done(null, user);
    }
})));
exports.default = passport_1.default;
