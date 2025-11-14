// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import controllers (correct path)
import {
  getWeatherInfo,
  getWeatherHistory,
  mockWeather,
  getUserAlerts,
  getWeeklySummary,
} from "./controllers/weatherController.js";

dotenv.config();

const app = express();
app.use(express.json());

// Serve static HTML pages
app.use("/pages", express.static("public_pages"));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Routes
app.post("/weather", getWeatherInfo);
app.post("/mock", mockWeather);
app.get("/history/:userId", getWeatherHistory);
app.get("/alerts/:userId", getUserAlerts);
app.get("/summary/:userId", getWeeklySummary);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
