// utils/riskPrediction.js
export const predictHealthRisk = (weather, aqi) => {
  const temp = weather?.main?.temp ?? 0;
  const humidity = weather?.main?.humidity ?? 0;
  const risks = [];

  // Heat-related
  if (temp > 35) risks.push("High risk of heatstroke");
  else if (temp > 30) risks.push("Moderate heat-related fatigue");

  // Cold-related
  if (temp < 10) risks.push("Risk of cold stress or hypothermia");

  // Air quality
  if (aqi >= 4) risks.push("Poor air quality — respiratory irritation likely");
  else if (aqi === 3) risks.push("Moderate air pollution — sensitive groups beware");

  // Humidity + heat
  if (humidity > 80 && temp > 30) risks.push("Dehydration risk due to high humidity and heat");

  return {
    overall: risks.length === 0 ? "No major health risks today" : risks.join("; "),
    details: risks,
  };
};
