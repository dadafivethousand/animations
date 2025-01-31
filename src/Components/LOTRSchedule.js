import React from "react";
import Schedule from "../Schedule"; // Correct import path
import "../Stylesheets/LOTRSchedule.css";

export default function LOTRSchedule({ day }) {
  const todaysSchedule = Schedule[day] || [];

  // Convert time to AM/PM format
  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes === 0 ? "00" : Math.round(minutes);
    return `${formattedHours}:${formattedMinutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="lotr-container">
      {/* LOTR Style Title */}
      <h1 className="lotr-title">Maple Jiu-Jitsu</h1>

      {/* The One Ring and Schedule */}
      <div className="ring-container">
        <div className="ring">
          <div className="schedule">
            <h2 className="lotr-subtitle">{day.toUpperCase()}</h2>
            {todaysSchedule.map((event, index) => (
              <div key={index} className="lotr-class">
                {event.name} {formatTime(event.start)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}