import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

export const authHandler = asyncHandler(async (req, res, next) => {
 try {
     const token = req.cookies?.accesstoken ||
       req.header("Authorization")?.replace("Bearer", "");
       // taking token 
     if (!token) {
       return res.status(400).json({
         message: "not token",
         sucess: false,
       });
     } 
   
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
     // validation 
   
     const user = await User.findById(decodedToken._id).select("-password -refreshToken");
   
     // finding user
   
     if (!user) {
       return res.status(400).json({
         message: "not user",
         sucess: false,
       });
     }
     // sending to req.user
     req.user = user;
     next()
 } catch (error) {
    console.log(error,"In finding tokens")
    
 }
});
