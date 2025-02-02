import React, { useEffect, useState } from "react";
import Schedule from "../Schedule"; // Corrected import path
import "../Stylesheets/GameOfThronesSchedule.css";

export default function GameOfThronesSchedule({ day }) {
  const todaysSchedule = Schedule[day] || [];
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    // Schedule reveals after swords cross
    setTimeout(() => {
      setShowSchedule(true);
    }, 1500);
  }, [day]);

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
    <div className="got-container">
      {/* Two swords sliding in */}
      <div className="sword-container">
        <div className="sword sword-left">🗡</div>
        <div className="sword sword-right">🗡</div>
      </div>

      {/* Schedule List */}
      <div className={`got-schedule ${showSchedule ? "show" : ""}`}>
        <h2 className="got-subtitle">{day.toUpperCase()}</h2>
        {todaysSchedule.map((event, index) => (
          <div key={index} className="got-class">
            {event.name} - {formatTime(event.start)} 
          </div>
        ))}
      </div>
    </div>
  );
}
