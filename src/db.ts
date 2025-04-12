import mongoose, { Mongoose } from "mongoose";
let objectId=mongoose.Types.ObjectId;

let userSchema=new mongoose.Schema({
    username:{type:String,require:true,unique:true},
    password:{type:String,require:true}
})


let contentSchema=new mongoose.Schema({
    link:String,
    type:{type:String},
    tag:[{type:String,ref:"Tags"}],
    user:{type:objectId,ref:"User"},
    title:String
});

let linkShareSchema=new mongoose.Schema({
    link:String,
    user:{type:objectId,ref:"User"}
})

let tagSchema=new mongoose.Schema({
    name:String,
    description:String
})

export const userModel= mongoose.model("User",userSchema);
export const contentModel= mongoose.model("Content",contentSchema);
export const shareModel= mongoose.model("Share",linkShareSchema);
export const tagModel= mongoose.model("Tags",tagSchema);

