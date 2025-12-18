import { asyncHandler } from "../utils/asynchandler.js"
import { User } from "../models/user.model.js"
import {uploadToCloudinary} from "../service/cloudnary.service.js"
import { authHandler } from "../middleware/auth.middleware.js"

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

const refreshAndAccesTokenGenerator = async (userid)=>{
  try {
      const user = await User.findById(userid)
      const refreshToken = user.refreshTokenGenerator()
      const accesToken = user.accessTokenGenerator()
      user.refreshToken = refreshToken
      await user.save({validateBeforeSave : false})

      return { refreshToken ,accesToken}
    
  } catch (error) {
    console.log(error,"Error in generating tokens")
    
  }
}

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
      const user = await User.findOne({
        username:username
      })

      if(!user){
        return res.status(401).json({
            message:"No user found ",
            success:false
        })
      }
      // check password correct or not
      const userPasswordIsCorrect = await user.isPasswordCorrect(password);

      if(!userPasswordIsCorrect){
        res.status(401).json({
            message:"Invalid credentials",
            success:false
        })
      }

      // accestoken and refreshtoken
       const {refreshToken , accessToken }=refreshAndAccesTokenGenerator(user._id);


       const loggedUser = await  User.findOne(user._id).select(
        "-password"
       )

       const option = {
        httpOnly:true,
        secure:true
       }

      return res.status(201)
      .cookie("accesstoken",accessToken,option)
      .cookie("refreshtoken", refreshToken , option)
      .json({
        message:"login succesful",
        success:true
      })



     }
)

const logoutUser = asyncHandler(
     async(req,res)=>{
        await User.findByIdAndUpdate(req.user._id,
            {
                $set:{
                     refreshToken : undefined
                }
                
            },
            {
                new:true
            }
        )

        const option ={
            httpOnly:true,
            secure:true
        }

        res.status(201)
        .clearCookie(accesstoken,option)
        .clearCookie(refreshtoken,option)
        .json({
            success:true,
            message:"logout success"
        })

     }
)

export {registerUser,loginUser,logoutUser}