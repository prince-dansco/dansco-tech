 import Author from "../model/auth.js";
import bcryptjs from "bcryptjs";
import { generatingToken } from "../utils/generatingToken.js";

export const registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const userAlreadyExist = await Author.findOne({ email });
    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashPassword = await bcryptjs.hash(password, 12);
    const user = new Author({
      email,
      password: hashPassword,
    });

    await user.save();

    generatingToken(res, user._id);
    res.status(201).json({
      success: true,
      message: "Created new user successfully",
      data: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error creating admin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const LoginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const user = await Author.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generatingToken(res, user._id);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Error logging in admin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const LogOutAdmin = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error logging out:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await Author.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error checking auth:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
