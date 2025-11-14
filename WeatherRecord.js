// models/WeatherRecord.js
import mongoose from "mongoose";

const weatherRecordSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    location: { type: String },
    temperature: { type: Number },
    humidity: { type: Number },
    condition: { type: String },
    aqiIndex: { type: Number },
    advice: { type: String },
    risk: { type: String },       // <-- new field to store predicted risk summary
    raw: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("WeatherRecord", weatherRecordSchema);
