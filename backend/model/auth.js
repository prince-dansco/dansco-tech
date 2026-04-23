import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"], 
      minlength: [6, "Password must be at least 6 characters long"], 
      maxlength: [128, "Password cannot exceed 128 characters"], 
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


const Author = mongoose.model('Author', userSchema); 
export default Author;