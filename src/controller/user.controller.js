import { asyncHandler } from "../utils/asynchandler.js"
import { User } from "../models/user.model.js"
import {uploadToCloudinary} from "../service/cloudnary.service.js"

const registerUser = asyncHandler(
    async (req,res) =>{
        // input data
        const {username, email , fullname , password} = req.body

        // check validation and trim it 
        if( !username?.trim() ||
            !email?.trim() ||
            !fullname?.trim() ||
            !password?.trim() ){
            return res.status(400).json({
                message : "empty string"
            })
        }
        // checking formattinf of email to do

        // find if user exist already or not 
        const alreadyUser = await User.findOne({
         $or: [{username: username } ,
             {email : email}
            ]})

        if(alreadyUser){
            return res.status(400).json({
                 success:false,
                message:"already a user "
            })
        }

        
        // avater and cover image 

          const avater = req.files?.avatar?.[0]?.path
          const coverimage = req.files?.coverimage?.[0]?.path


         const uploadedAvater = await uploadToCloudinary(avater);
         const UploadedCoverimage =coverimage? await uploadToCloudinary(coverimage):null;
         


         if(!uploadedAvater){
            return res.status(400).json({
                success:false,
                message:"failed to upload"
            })
         }

        // creating user 
        const user = await User.create({
            fullname:fullname,
            username:username.trim().toLowerCase(),
            avatar:uploadedAvater.url,
            coverimage:UploadedCoverimage?.url || "",
            email : email,
            password : password
        })

        const createdUser =  await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if(!createdUser){
            return res.status(400).json({
                message:"error in creating database",
                success:false
            })
        }



        return res.status(201).json({
            success:true,
            message:"User created succesfully",
            Userdata: createdUser
        })
    }
)

const loginUser = asyncHandler(
     async (req, res) => {
      const {username , password} = req.body
      // validating feild
      if(!username?.trim() || !password?.trim()){
         return res.status(401).json({
            success:false,
            message:"Empty feild"
        })
      }

      // checking user 
      const userExist = await User.findOne({
        username:username
      })

      if(!userExist){
        return res.status(401).json({
            message:"No user found ",
            success:false
        })
      }
      // check password correct or not
      const userPasswordIsCorrect =  User.isPasswordCorrect(password);

      if(!userPasswordIsCorrect){
        res.status(401).json({
            message:"Invalid credentials",
            success:false
        })
      }

      // accestoken and refreshtoken

      return res.status(201).json({
        message:"login succesful",
        success:true
      })



     }
)

export {registerUser,loginUser}