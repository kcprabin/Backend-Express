import mongoose,{Schema} from "mongoose"
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    avatar:{          // FIXED: avater -> avatar
        type:String,
        required:true,
    },
    coverImage:{      // camelCase
        type:String,
    },
    password:{
        type:String,
        required:true,    
    },
    watchHistory:[    // camelCase
        {
            type: Schema.Types.ObjectId,
            ref: "Video"    // FIXED: Vedio -> Video
        }
    ],
    refreshToken:{     // camelCase
        type:String
    }

},{timestamps:true})

export const User = mongoose.model("User", userSchema)
