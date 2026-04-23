// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from 'path';
// import cookieParser from "cookie-parser";

// import userRoute from "./route/userRoute.js";
// import authRoute from "./route/authRoute.js";
// import connectDB from "./config/db.js";


// dotenv.config();

// const app = express();
// const __dirname = path.resolve();

// // CORS configuration - this must be before other middleware
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//     exposedHeaders: ["Set-Cookie"],
//   })
// );

// // Middleware - order matters!
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Routes
// app.use("/api/user", userRoute);
// app.use("/api/auth", authRoute);


// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get('*', (req, res)=>{
//     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
//   })
// }



// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: "Internal server error",
//   });
// });



// const PORT = process.env.PORT || 8000;

// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error, "Server failed to start. Please be patient.");
//   });



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

// ✅ IMPROVED CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://dansco-tech.onrender.com", // Your Render frontend URL
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(null, true); // For development - remove in production
        // callback(new Error('Not allowed by CORS')); // Uncomment in production
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Error handler
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
      console.log(`CORS enabled for origins:`, allowedOrigins);
    });
  })
  .catch((error) => {
    console.log(error, "Server failed to start. Please be patient.");
  });