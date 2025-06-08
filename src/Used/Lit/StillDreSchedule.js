import React, { useEffect, useState } from "react";
import Schedule from "../Schedule"; // Adjust path accordingly
import "../Stylesheets/StillDreSchedule.css";
import greenleaf from '../Images/leaf.webp';

export default function StillDreSchedule({ day }) {
  const todaysSchedule = Schedule[day] || [];
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    // Display one line at a time with a delay

    const interval = setInterval(() => {
      setVisibleLines((prev) => (prev < todaysSchedule.length ? prev + 1 : prev));
    }, 350); // Delay between each line (0.5 seconds)

    // Cleanup interval
    return () => clearInterval(interval);
  }, [todaysSchedule.length]);

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
    <div className="stilldre-outer-container">
      <div className="stilldre-container">
        <h1 className="stilldre-text">MAPLE JIU-JITSU</h1>
        <div className="stilldre-schedule">
          <h2 className="schedule-subtitle">{day.toUpperCase()}</h2>
          {todaysSchedule.slice(0, visibleLines).map((event, index) => (
            <div key={index} className={`schedule-class ${event.cancelled ? 'stilldre-red': ''}`}>
              {event.name} - {formatTime(event.start)}  {event.cancelled ? <p>Cancelled</p>: '' } 
            </div>
          ))}
        </div>
        <div className="stilldre-bottom-flex">
          <img src={greenleaf} alt="Green Leaf" />
          <h1 className="stilldre-text year">2o25</h1>
        </div>
      </div>
    </div>
  );
}