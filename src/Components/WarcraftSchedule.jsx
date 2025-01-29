import React, { useEffect, useState } from "react";
import Schedule from "../Schedule"; // Corrected path for consistency
import "../Stylesheets/WarcraftSchedule.css";

export default function WarcraftSchedule({ day }) {
  const todaysSchedule = Schedule[day] || [];
  const [visibleClasses, setVisibleClasses] = useState([]);

  // Function to Convert 24-Hour Time to AM/PM
  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes === 0 ? "00" : Math.round(minutes);
    return `${formattedHours}:${formattedMinutes.toString().padStart(2, "0")} ${period}`;
  };

  // Reveal class times one by one
  useEffect(() => {
    todaysSchedule.forEach((event, index) => {
      setTimeout(() => {
        setVisibleClasses((prev) => [...prev, event]);
      }, index * 600); // Faster reveal for mobile UX
    });
  }, [todaysSchedule]);

  return (
    <div className="warcraft-mobile-container">
      {/* Day Name Appears Like a Summoned Rune */}
      <h1 className="warcraft-mobile-day">{day}</h1>

      {/* Class Times Appear as Magical Runes */}
      <ul className="warcraft-mobile-class-list">
        {visibleClasses.map((event, index) => (
          <li key={index} className="warcraft-mobile-class-item">
            {event.name} ({formatTime(event.start)} - {formatTime(event.end)})
          </li>
        ))}
      </ul>
    </div>
  );
}
