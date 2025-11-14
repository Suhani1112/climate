import React, { useEffect, useState } from "react";
import axios from "axios";
export default function SafeZoneMap() {
  const [zones, setZones] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/zones")
      .then(res => setZones(res.data))
      .catch(() => setZones([{name:'No safe zones found'}]));
  }, []);
  return (
    <div>
      <h2>Safe Zones (Evacuation)</h2>
      <ul>
        {zones.map((zone, i) => <li key={i}>{zone.name} - {zone.location}</li>)}
      </ul>
    </div>
  );
}
