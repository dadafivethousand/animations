import React from "react";
import Schedule from "../../RhSchedule"; // Capitalized as requested
import "./GodfatherSchedule.css";

export default function GodfatherSchedule({ day }) {
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
    <div className="godfather-container">
      {/* Title */}
 
 

      {/* Schedule */}
      <div className="parchment">
        <h2>{day}</h2>
        <ul className="schedule-list">
          {todaysSchedule.length > 0 ? (
            todaysSchedule.map((event, index) => (
              <li className="godfather-class" key={index}>
               <span>{event.name}  </span>   <span>{formatTime(event.start)}</span>
                              </li>
            ))
          ) : (
            <li>No classes today. Rest up!</li>
          )}
        </ul>
      </div>
    </div>
  );
}
