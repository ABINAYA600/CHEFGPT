// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import aiRoutes from "./routes/aiRoutes.js";             
import authRoutes from "./routes/authRoutes.js";         
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();
const app = express();

// ===============================
// CHECK REQUIRED ENV VARIABLES
// ===============================
if (!process.env.OPENROUTER_API_KEY) {
  console.warn("⚠️ WARNING: OPENROUTER_API_KEY is missing in .env — AI features will not work!");
}
if (!process.env.MONGO_URI) {
  console.warn("⚠️ WARNING: MONGO_URI is missing in .env — database will fail to connect!");
}

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors({
  origin: "*", // change to frontend domain in production
}));

app.use(express.json({ limit: "15mb" })); // Support large AI image uploads

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// ===============================
// ROUTE MOUNTING
// ===============================
app.use("/api/ai", aiRoutes);              
app.use("/api/auth", authRoutes);          
app.use("/api/recipes", recipeRoutes);

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// MONGODB CONNECTION (with auto retry)
// ===============================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    console.log("🔁 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🔌 OpenRouter AI Enabled:", !!process.env.OPENROUTER_API_KEY);
});
