import React, { useEffect, useState } from "react";
import "./CasinoSchedule.css";
import schedule from "../RhSchedule";

export default function CasinoSchedule({ day, animationDelay = 1500, animationInterval = 250 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")}  `;
  };

  const getChipColor = (index, total) => {
    if (index === 0 || index === total - 1) return "#111111"; // black for first & last
    const colors = ["#d40000", "#0047ab", "#009933", "#f0c000"];
    return colors[(index - 1) % colors.length];
  };

  const getScatterClass = (index) => {
    const positions = ["scatter-left", "scatter-right", "scatter-center"];
    return positions[index % positions.length];
  };

  const entries = schedule[day] || [];

  return (
    <div className="casino-wrapper">
      <h3 className="casino-title">{day.toUpperCase()}</h3>
      <div className="casino-scatter">
        {entries.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              className={`poker-chip ${getScatterClass(idx)}`}
              key={idx}
              style={{ color: getChipColor(idx, entries.length) }}
            >
              <div className="chip-inner">
                <span className="chip-class">{cls.name}</span>
                <span className="chip-time">{formatTime(cls.start)}</span>
                <span>PM</span>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
