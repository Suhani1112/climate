import axios from "axios";
import dotenv from "dotenv";
import WeatherRecord from "../models/WeatherRecord.js";
import { generateHealthAdvice } from "../utils/healthAdvice.js";
import { predictHealthRisk } from "../utils/riskPrediction.js";

dotenv.config();

const OWM = "https://api.openweathermap.org/data/2.5";

/**
 * POST /weather
 * Fetch real weather data + AQI + generate advice + predict health risk + save to MongoDB
 */
export const getWeatherInfo = async (req, res) => {
  try {
    const { lat, lon, userId, includeAQI } = req.body;

    if (!lat || !lon || !userId) {
      return res.status(400).json({ error: "lat, lon, and userId are required" });
    }

    // 1️⃣ Current weather from OpenWeather
    const weatherResp = await axios.get(`${OWM}/weather`, {
      params: { lat, lon, units: "metric", appid: process.env.OPENWEATHER_API_KEY },
    });
    const weather = weatherResp.data;

    // 2️⃣ Optionally fetch Air Quality Index
    let aqiIndex = null;
    if (includeAQI) {
      try {
        const aqiResp = await axios.get(`${OWM}/air_pollution`, {
          params: { lat, lon, appid: process.env.OPENWEATHER_API_KEY },
        });
        aqiIndex = aqiResp.data?.list?.[0]?.main?.aqi ?? null;
      } catch (aqiErr) {
        console.warn("AQI fetch failed:", aqiErr.message);
      }
    }

    // 3️⃣ Generate health advice + AI-style health risk
    const advice = generateHealthAdvice(weather, aqiIndex);
    const healthRisk = predictHealthRisk(weather, aqiIndex);

    // 4️⃣ Save record in MongoDB
    const record = new WeatherRecord({
      user_id: userId,
      location: weather.name || `${lat},${lon}`,
      temperature: weather.main?.temp ?? null,
      humidity: weather.main?.humidity ?? null,
      condition: weather.weather?.[0]?.description ?? null,
      aqiIndex,
      advice,
      risk: healthRisk.overall, // new field
      raw: weather,
    });

    await record.save();

    // 5️⃣ Respond to client
    res.json({
      location: weather.name || `${lat},${lon}`,
      coords: weather.coord,
      temperature: weather.main?.temp,
      humidity: weather.main?.humidity,
      condition: weather.weather?.[0]?.description,
      aqiIndex,
      advice,
      healthRisk,
    });
  } catch (err) {
    console.error("getWeatherInfo error:", err.response?.data ?? err.message);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
};

/**
 * GET /history/:userId
 * Fetch recent weather records for a user
 */
export const getWeatherHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const history = await WeatherRecord.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ history });
  } catch (err) {
    console.error("getWeatherHistory error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /alerts/:userId
 * Fetch high-risk alerts for a user
 */
export const getUserAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const records = await WeatherRecord.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const alerts = records
      .filter((r) => r.risk && !r.risk.toLowerCase().includes("no major"))
      .map((r) => ({
        id: r._id,
        date: r.createdAt,
        location: r.location,
        alert: r.risk,
        advice: r.advice,
      }));

    res.json({ alerts });
  } catch (err) {
    console.error("getUserAlerts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET /summary/:userId
 * Weekly averages and recent risk summary
 */
export const getWeeklySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const records = await WeatherRecord.find({
      user_id: userId,
      createdAt: { $gte: oneWeekAgo },
    }).sort({ createdAt: -1 });

    if (!records.length) return res.json({ message: "No data for the last 7 days" });

    const avgTemp =
      records.reduce((sum, r) => sum + (r.temperature ?? 0), 0) / records.length;
    const avgHumidity =
      records.reduce((sum, r) => sum + (r.humidity ?? 0), 0) / records.length;

    res.json({
      daysOfData: records.length,
      avgTemp: Number(avgTemp.toFixed(1)),
      avgHumidity: Number(avgHumidity.toFixed(1)),
      recentRisk: records[0]?.risk ?? "No data",
    });
  } catch (err) {
    console.error("getWeeklySummary error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * POST /mock
 * Fake data for local testing
 */
export const mockWeather = async (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: "userId is required" });

  // Fake weather data
  const fakeWeather = {
    location: "Test City",
    coords: { lat: 40.7128, lon: -74.006 },
    temperature: 25,
    humidity: 55,
    condition: "clear sky",
    aqiIndex: 2,
  };

  const advice =
    "The weather is clear and air quality is good — perfect day for outdoor activity!";

  try {
    const WeatherRecord = (await import("../models/WeatherRecord.js")).default;
    const record = new WeatherRecord({
      user_id: userId,
      location: fakeWeather.location,
      temperature: fakeWeather.temperature,
      humidity: fakeWeather.humidity,
      condition: fakeWeather.condition,
      aqiIndex: fakeWeather.aqiIndex,
      advice,
      risk: "No major health risks today",
      raw: fakeWeather,
    });
    await record.save();
  } catch (err) {
    console.warn("Mock record save failed:", err.message);
  }

  res.json({ ...fakeWeather, advice });
};
