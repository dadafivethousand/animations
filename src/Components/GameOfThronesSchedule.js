import React from "react";
import Schedule from "../Schedule"; // Corrected import path
import "../Stylesheets/GameOfThronesSchedule.css";

export default function GameOfThronesSchedule({ day }) {
  const todaysSchedule = Schedule[day] || [];

  // Function to Convert 24-Hour Time to AM/PM
  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes === 0 ? "00" : Math.round(minutes);
    return `${formattedHours}:${formattedMinutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="got-container">
      {/* Title */}
      <h1 className="got-title">{day.toUpperCase()}</h1>

      {/* Schedule List */}
      <div className="got-schedule">
        {todaysSchedule.map((event, index) => (
          <div key={index} className="got-class">
            {event.name} ({formatTime(event.start)} - {formatTime(event.end)})
            {index !== todaysSchedule.length - 1 && <div className="sword-divider"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
