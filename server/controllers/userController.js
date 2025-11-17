
import User from "../models/user.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


//signup new user
export const signUp=async(req,res)=>{
  try{
    const {email,fullName,password,bio}=req.body;

    if(!email || !fullName || !password || !bio){
      res.json({success:false,message:"All fields are required"})
    }

    const user =await User.findOne({email})
    if(user){
       res.json({success:false,message:"User already exists"})
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser= await User.create({
      email,
      fullName,
      password:hashedPassword,
      bio
    })

    const token =generateToken(newUser._id);
     res.json({
      success:true,
      userData:newUser,
      token:token,
      message:"Account registered successfully",
    })
    

  }catch(error){
    console.log(error.message);
     res.json({success:false,message:error.message});

  }
}

//controller for Login a user
export const login=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      res.json({success:false,message:"All fields are required"})
    }
    const userData=await User.findOne({email});
    const isPasswordCorrect=await bcrypt.compare(password,userData.password);
    if(!isPasswordCorrect){
       res.json({success:false,message:"Invalid credentials"})
    }
    const token=generateToken(userData._id);
     res.json({
      success:true,
      userData,
      token,
      message:"Login successful"
    })
    
  }catch(error){
    console.log(error.message);
     res.json({success:false,message:error.message});
  }

}

//controller to check if user is authenticated

export const checkAuth=async(req,res)=>{
  res.json({
    success:true,
    user:req.user
  })
}

//controller for update user profile
export const updateProfile=async(req,res)=>{
  try{
    const {profilePic,bio,fullName}=req.body;
    const userId=req.user._id;
    let updatedUser;
    if(!profilePic){
      updatedUser=await User.findByIdAndUpdate(userId,{fullName,bio},{new:true});//new:true to return updated document

    }else{
      const upload=await cloudinary.uploader.upload(profilePic);
      updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,fullName,bio},{new:true});

    }
    res.json({
      success:true,
      user:updatedUser,
      message:"Profile updated successfully"
    })
  }catch(error){
    console.log
    res.json({  success:false,message:error.message});
  }
  
}