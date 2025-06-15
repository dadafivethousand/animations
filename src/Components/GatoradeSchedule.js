import React, { useEffect, useState } from "react";
import "../Stylesheets/GatoradeSchedule.css";
import schedule from "../Schedule";

const GATOR_STYLES = [
  { name: "gator-blue", color: "#00a3e0" },
  { name: "gator-orange", color: "#ff6200" },
  { name: "gator-green", color: "#78be20" },
  { name: "gator-red", color: "#f0573b" },
  { name: "gator-purple", color: "#8e3dae" },
];

export default function GatoradeSchedule({ day, animationDelay = 1800, animationInterval = 200 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    setVisibleArray([]);
    const arr = schedule[day] || [];
    arr.forEach((_, idx) =>
      setTimeout(() => setVisibleArray(v => [...v, idx]), 
        animationDelay + idx * animationInterval
      )
    );
  }, [day, animationDelay, animationInterval]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex(idx => (idx + 1) % GATOR_STYLES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const accentColor = GATOR_STYLES[colorIndex].color;

  const formatTime = dt => {
    const hour = Math.floor(dt);
    const minutes = Math.round((dt - hour) * 60);
    const hr12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${hr12}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
  };

  return (
    <div 
      className="gator-container" 
      style={{ backgroundColor: accentColor, '--accent': accentColor }}
    >
      <h1 className="gator-header">{day.toUpperCase()}</h1>
      <div className="gator-track">
        {schedule[day]?.map((cls, idx) => visibleArray.includes(idx) && (
          <div key={idx} className="gator-class">
            <span className="gator-class-name">{cls.name}</span>
            <span className="gator-class-time">{formatTime(cls.start)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
