import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import {Server} from 'socket.io';

//create Express app and HTTP server
const app=express();
const server=http.createServer(app);

//Initialize Socket.io server
export const io=new Server(server,{
  cors:{
    origin:"*"
  }
})

//store online variables
export const userSocketMap={};//userId:socketId

//socket.io connection handler
io.on('connection',(socket)=>{
  const userId=socket.handshake.query.userId;
  console.log("User connected:",userId);
 
  if(userId){
    userSocketMap[userId]=socket.id;
  }
  //Emmit online users to all connected clients
  io.emit('getOnlineUsers',Object.keys(userSocketMap));
  socket.on('disconnect',()=>{
    console.log("User disconnected:",userId);
    delete userSocketMap[userId];//it is built in methid delete the values from object
    io.emit('getOnlineUsers',Object.keys(userSocketMap));
  })
})



//middlewares support 
app.use(express.json({limit:'4mb'}));
app.use(cors());
app.use("/api/status",(req,res)=>{
  return res.send("Server is Live")
})

//Routes setup

app.use('/api/auth',userRouter)
app.use('/api/messages',messageRouter);

//Connect to database
await connectDB();


if(process.env.NODE_ENV!=="production"){
    const PORT=process.env.PORT || 5000;
    server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
}

//export server for versel deployment
export default server;

