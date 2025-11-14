// routes/weatherRoutes.js
import express from "express";
import { getWeatherInfo, getWeatherHistory, mockWeather } from "../controllers/weatherController.js";

const router = express.Router();

// Real weather route (for live API)
router.post("/weather", getWeatherInfo);

// Mock route (for testing before API activation)
router.post("/mock", mockWeather);

// User weather history
router.get("/history/:userId", getWeatherHistory);

export default router;
