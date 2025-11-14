import React, { useEffect, useState } from "react";
import axios from "axios";
export default function AlertPanel() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/alerts")
      .then(res => setAlerts(res.data))
      .catch(() => setAlerts([{text:'No alerts available'}]));
  }, []);
  return (
    <div>
      <h2>Real-Time Alerts</h2>
      <ul>
        {alerts.map((a, i) => <li key={i}>{a.text}</li>)}
      </ul>
    </div>
  );
}
