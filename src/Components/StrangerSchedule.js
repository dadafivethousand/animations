import React, { useEffect, useState } from "react";
import "../Stylesheets/CasinoSchedule.css";
import schedule from "../Schedule";

export default function CasinoSchedule({ day, animationDelay = 500, animationInterval = 250 }) {
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
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const getChipColor = (index) => {
    const colors = ["#111111", "#d40000", "#0047ab", "#009933", "#f0c000"]; // black, red, blue, green, gold
    return colors[index % colors.length];
  };

  return (
    <div className="casino-wrapper">
      <h3 className="casino-title">{day.toUpperCase()}</h3>
      <div className="casino-scatter">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              className={`poker-chip scatter-${idx % 3} ${idx%2===0 ? 'poker-left':''}`}
              key={idx}
              style={{ color: getChipColor(idx) }}
            >
              <div className="chip-inner">
                <span className="chip-class">{cls.name}</span>
                <span className="chip-time">{formatTime(cls.start)}</span>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
