// utils/healthAdvice.js

/**
 * Generate personalized health advice based on weather conditions and air quality.
 * This runs every time a user requests weather data.
 */
export const generateHealthAdvice = (weather, aqi) => {
  const temp = weather?.main?.temp ?? 0;
  const humidity = weather?.main?.humidity ?? 0;
  const condition = weather?.weather?.[0]?.main?.toLowerCase() ?? "clear";

  let advice = "";

  // 🌡️ Temperature-based advice
  if (temp > 40) {
    advice = "Extreme heat! Stay indoors, drink plenty of water, and avoid direct sunlight.";
  } else if (temp > 35) {
    advice = "Very hot today — wear light clothing and stay hydrated.";
  } else if (temp > 30) {
    advice = "Warm weather — drink water frequently and avoid heavy physical activity at midday.";
  } else if (temp < 10 && temp >= 0) {
    advice = "Cold weather — wear warm layers and cover your head and hands.";
  } else if (temp < 0) {
    advice = "Freezing conditions! Stay indoors if possible and wear insulated clothing.";
  }

  // 💧 Humidity-based advice
  if (humidity > 85) {
    advice += " The humidity is high — watch for mold growth and dehydration.";
  } else if (humidity < 30) {
    advice += " Air is dry — use a humidifier and apply moisturizer to prevent dry skin.";
  }

  // 🌫️ Weather condition advice
  if (condition.includes("rain")) {
    advice += " Carry an umbrella and wear waterproof shoes.";
  } else if (condition.includes("snow")) {
    advice += " Snowy weather — wear non-slip shoes and stay warm.";
  } else if (condition.includes("storm")) {
    advice += " Thunderstorms possible — stay indoors until it clears.";
  } else if (condition.includes("cloud")) {
    advice += " Cloudy day — UV exposure is lower, but stay active!";
  } else if (condition.includes("clear")) {
    advice += " Great weather — ideal for outdoor activities.";
  }

  // 💨 Air quality (AQI: 1–5)
  if (aqi !== null && aqi !== undefined) {
    if (aqi === 5) {
      advice += " Air quality is very poor — wear a mask and avoid outdoor activity.";
    } else if (aqi === 4) {
      advice += " Poor air quality — sensitive individuals should limit outdoor exposure.";
    } else if (aqi === 3) {
      advice += " Moderate air quality — mild caution advised for those with asthma.";
    } else if (aqi === 2) {
      advice += " Air quality is good — safe for outdoor activities.";
    } else if (aqi === 1) {
      advice += " Excellent air quality — breathe easy!";
    }
  }

  // ✨ Fallback if advice is still empty
  if (!advice) {
    advice = "Weather looks normal — maintain a balanced routine and stay healthy.";
  }

  return advice.trim();
};
