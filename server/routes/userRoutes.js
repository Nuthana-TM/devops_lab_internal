import express from 'express';

import { signUp, login,updateProfile,checkAuth } from '../controllers/userController.js';
import { protectRoute } from '../middlewares/auth.js';
const userRouter=express.Router();

userRouter.get('/',(req,res)=>{
  res.send("User route is working");
});
userRouter.post('/signup',signUp);
userRouter.post('/login',login);
userRouter.put('/update-profile',protectRoute,updateProfile);
userRouter.get('/check-auth',protectRoute,checkAuth);

export default userRouter;