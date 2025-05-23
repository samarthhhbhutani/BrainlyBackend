import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { userModel } from "./db";

const JWT_SECRET = "12341234";
console.log(process.env.CLIENT_ID)
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
// --- Passport Google Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID ||"",
      clientSecret: process.env.CLIENT_SECRET ||"",
      callbackURL: "https://brainlybackend-7fcv.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        userId: profile.id,
        username: profile.displayName,
      };
      const existinguser= await userModel.findOne({username:profile.displayName});
      if(existinguser){
        console.log("User already exists in DB",existinguser);
        return done(null, existinguser);
      }else{
        const user=await userModel.create({
            username:profile.displayName,
            googleId:profile.id
        })
        return done(null, user);
      }

      
    }
  )
);



export default passport;
