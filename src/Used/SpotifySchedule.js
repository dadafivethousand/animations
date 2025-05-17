import React, { useEffect, useState } from "react";
import "../Stylesheets/SpotifySchedule.css";
import schedule from "../Schedule";

export default function SpotifySchedule({ day, animationDelay = 1800, animationInterval = 250 }) {
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

  return (
    <div className="spotify-wrapper">
      <div className="spotify-header">
        <div className="spotify-logo" />
        <h1 className="spotify-title">{day.toUpperCase()}</h1>
      </div>
      <div className="spotify-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="spotify-card" key={idx}>
              <div className="spotify-play">
                <div className="circle">
                  <span className="arrow">▶</span>
                </div>
              </div>
              <div className="spotify-info">
                <span className="spotify-class">{cls.name}</span>
                <span className="spotify-time">{formatTime(cls.start)}</span>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
