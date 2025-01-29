import React from "react";
import Schedule from "../Schedule"; // Updated import path
import "../Stylesheets/HulkamaniaSchedule.css";

export default function HulkamaniaSchedule({ day }) {
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
    <div className="hulkamania-container-theme">
      {/* Title */}
      <h1 className="hulkamania-title-theme">HULKAMANIA SCHEDULE</h1>

      {/* Wrestling Ropes */}
      <div className="hulkamania-ring-ropes-theme"></div>

      {/* Schedule */}
      <div className="hulkamania-parchment-theme">
        <h2>{day}'s Schedule</h2>
        <ul className="hulkamania-schedule-list-theme">
          {todaysSchedule.length > 0 ? (
            todaysSchedule.map((event, index) => (
              <li key={index} className="hulkamania-schedule-item-theme">
                {event.name} ({formatTime(event.start)} - {formatTime(event.end)})
              </li>
            ))
          ) : (
            <li className="hulkamania-schedule-item-theme">No matches today, brother!</li>
          )}
        </ul>
      </div>
    </div>
  );
}
