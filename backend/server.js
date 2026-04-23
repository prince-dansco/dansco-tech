import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import cookieParser from "cookie-parser";

import userRoute from "./route/userRoute.js";
import authRoute from "./route/authRoute.js";
import connectDB from "./config/db.js";


dotenv.config();

const app = express();
const __dirname = path.resolve();

// CORS configuration - this must be before other middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Middleware - order matters!
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  })
}



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});



const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error, "Server failed to start. Please be patient.");
  });
