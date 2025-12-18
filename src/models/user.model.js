import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// hooks that save incrypted password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// refresh tokens and acces tokes
userSchema.methods.refreshTokenGenerator = function () {
  jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.accessTokenGenerator = function () {
  jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
