

//get all the users execpt the logged in user


import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import {io} from "../server.js";
import User from "../models/user.js";
import { userSocketMap } from "../server.js";


export const getUserForSidebar=async(req,res)=>{
  try {
    
    const userId=req.user._id;
    const filteredUsers=await User.find({_id:{$ne:userId}}).select("-password");

    //count the number of messages not seen

    const unseenMessages={};
    const promises=filteredUsers.map(async(user)=>{
      const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false});
      if(messages.length>0){
        unseenMessages[user._id]=messages.length;
      }
    })
   
    await Promise.all(promises);//here we use Promise.all to wait for all the async operations to complete
    res.json({
      success:true,
      users:filteredUsers,
      unseenMessages:unseenMessages
    })
  } catch (error) {
    console.log(error.message);
    res.json({
      success:false,
      message:error.message
    })
  }
}

//get all the messages for selected user

export const getMessages=async(req,res)=>{
  try {
    const {id:selectedUserId}=req.params;
    const myId=req.user._id;
    const messages=await Message.find({
      $or:[
        {senderId:selectedUserId,receiverId:myId},
        {senderId:myId,receiverId:selectedUserId}
      ]
    })

    await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true})
    
    res.json({
      success:true,
      messages
    })

  } catch (error) {
    console.log(error.message);
    res.json({
      success:false,
      message:error.message
    })
    
  }
}

//api to mark messages as seen using message id
export const markMessageAsSeen=async(req,res)=>{
  try {
    const {id}=req.params;
    await Message.findByIdAndUpdate(id,{seen:true});
    res.json({
      success:true,})
    
  } catch (error) {
    console.log(error.message);
    res.json({
      success:false,
      message:error.message
    })
  }
}



//send messages to selected user
export const sendMessage=async(req,res)=>{
  try {
    const {text,image}=req.body;
    const senderId=req.user._id;
    const receiverId=req.params.id;

    let imageUrl;
    if(image){
      const uploadResponse=await cloudinary.uploader.upload(image);
      imageUrl=uploadResponse.secure_url;
    }
    const newMessage=await Message.create({
      senderId,
      receiverId,
      text,
      image:imageUrl
    })
    //Emmit the new messages to the receiver's socket
    const receiverSocketId=userSocketMap[receiverId];
    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage',{ ...newMessage._doc });
    }
    res.json({
      success:true,
      newMessage:{ ...newMessage._doc }
    })

    
  } catch (error) {
    console.log(error.message);
    res.json({
      success:false,
      message:error.message
    })
  }
}