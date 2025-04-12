import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { z } from "zod"
const app=express();
import { userModel,contentModel,shareModel,tagModel } from "./db";
import Auth from "./middlewares";
const JWT_SECRET="12341234";
import cors from 'cors'
mongoose.connect("mongodb+srv://samarthhbhutani:Samarth123@cluster0.4yqnw.mongodb.net/brainly");
import googleAuthRouter from "./passport"; 
import passport from "passport";
import './passport.js'


const usernameSchema=z.string().min(3).max(10);
const passwordSchema=z.string().min(8).max(20);

app.use(express.json());
app.use(cors());


app.post("/api/v1/signup",async function(req,res){
    let username=req.body.username;
    let password=req.body.password;
    console.log(username);
    console.log(password);
    try{
        usernameSchema.parse(username)
        passwordSchema.parse(password);
    }catch{
        res.status(411).json({
            message:"Error in Inputs"
        });
        return;
    }
    
    try{
        await userModel.create({
            username:username,
            password:password
        })
        res.status(200).json({
            message:"User Added"
        })
    }catch(e){
        res.status(403).json({
            message:e
        })
    }
})

app.post("/api/v1/signin",async function(req,res){
    let username=req.body.username;
    let password=req.body.password;

    const user=await userModel.findOne({username:username,password:password})
    
    if(user){
        const token=jwt.sign({userId:user._id},JWT_SECRET);

        res.status(200).json({
            token:token
        })
    }else{
        res.status(403).json({
            message:"Wrong email password"
        })
    }
})

app.post("/api/v1/content",Auth,async function(req,res){
    console.log("Post content")

    const userId=req.body.userId;
    const link=req.body.link;
    const type=req.body.type;
    const title=req.body.title
    console.log(userId, link,type);
    await contentModel.create({
        link:link,
        type:type,
        user:userId,
        title:title
    })

    res.json({message:"Post created"});
})

app.get("/api/v1/content",Auth,async function(req,res){
    console.log("Get content")
    const userId=req.body.userId;
    const posts=await contentModel.find({
        user:userId
    })
    res.status(200).json({
        content:posts
    })
})

app.post("/api/v1/content/media",Auth,async function(req,res){
    console.log("Get content media")
    const userId=req.body.userId;
    const type=req.body.type;
    const posts=await contentModel.find({
        user:userId,
        type:type
    })
    res.status(200).json({
        content:posts
    })
})

app.delete("/api/v1/content",Auth,async function(req,res){
    const userId=req.body.userId;
    const contentId=req.body.contentId;
    await contentModel.deleteMany({user:userId, _id:contentId})
    res.json({message:"Content deleted"});
})


app.post("/api/v1/brain/share",Auth,async function(req,res){
    console.log("Share content")

    const userId=req.body.userId;
    console.log("HERE: ",userId);
    await shareModel.create({link:userId,user:userId});
    res.json({
        link:userId
    })
})

app.get('/api/v1/checkUser',Auth,function(req,res){
    res.status(200).json({
        message:"User is signed in"
    })
})


app.delete("/api/v1/brain/share",Auth,async function(req,res){
    const userId=req.body.userId;
    await shareModel.deleteOne({user:userId});
    res.status(201).json({
        message:"Share link deleted"
    })
})

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req: any, res) => {
        console.log("INSIDE");
      const user = req.user;
      const token = jwt.sign(
        { userId: user.userId, username: user.username },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      // 🟢 Option 1: Redirect to frontend with token
      // res.redirect(`http://localhost:3000?token=${token}`);
  
      // 🔵 Option 2: Send JWT in response (JSON)
      res.redirect("https://brainly-xi.vercel.app/dashboard?token="+token);
    }
  );
  

app.get("/api/v1/brain/checkShare",Auth,async function(req,res){
    const userId=req.body.userId;
    try{
        const user=await shareModel.findOne({user:userId});
        res.status(200).json({
            message:"Share link exists"
        })
    }
    catch(e){
        res.status(403).json({
            message:"No share link"
        })
    }
})

app.get("/api/v1/brain/:shareLink",async function(req,res){
    const link=req.params.shareLink;
    const user=await shareModel.findOne({link:link});
    if(user){
        console.log("ShareLink ",user);
        const posts=await contentModel.find({user:user.user});
        const userdets=await userModel.findOne({_id:user.user});
        res.json({
            content:posts,
            user:userdets?.username
        });
    }else{
        res.status(403).json({
            message:"Incorrect share link"
        });
    }
})

app.listen(3000);
