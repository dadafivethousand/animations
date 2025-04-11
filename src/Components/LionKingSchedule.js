import React, { useState, useEffect } from "react";
import "../Stylesheets/LionKingSchedule.css";
import Schedule from "../Schedule.js";

export default function LionKingIntro() {
  const [sunY, setSunY] = useState(100);
  const [showSchedule, setShowSchedule] = useState(false);
  const day = "Tuesday";

  useEffect(() => {
    const interval = setInterval(() => {
      setSunY((prev) => {
        const next = Math.max(prev - 1, -50);
        if (next === -50) clearInterval(interval);
        return next;
      });
    }, 100);

    const timeout = setTimeout(() => setShowSchedule(true), 11000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Only brighten if sun is above horizon
  let brightness = 0;
  if (sunY < 0) {
    const progress = (0 - sunY) / 50; // from 0 to 1
    const eased = Math.pow(progress, 1.5); // smoother ramp-up
    brightness = Math.floor(eased * 255);
  }

  const r = brightness;
  const g = Math.floor(brightness * 0.65);
  const b = Math.floor(brightness * 0.25);

  return (
    <div
      className="scene"
      style={{
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
      }}
    >
      <div
        className="sun"
        style={{
          transform: `translate(-50%, ${sunY}px)`,
        }}
      ></div>

      <div className="horizon"></div>

      {showSchedule && (
        <div className="schedule-wrapper">
          <h1>{day.toUpperCase()}</h1>
          {Schedule[day]?.map((cls, idx) => (
            <div
              key={idx}
              className="schedule-entry"
              style={{ animationDelay: `${idx * 0.3}s` }}
            >
              🦁 <strong>{cls.name}</strong> — {formatTime(cls.start)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(decimalTime) {
  const hour = Math.floor(decimalTime);
  const minutes = Math.round((decimalTime - hour) * 60);
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const amPm = hour < 12 ? "AM" : "PM";
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
}
