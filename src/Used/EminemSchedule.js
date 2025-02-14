import React, { useEffect, useState } from "react";
import Schedule from "../Schedule"; // Adjust path accordingly
import "../Stylesheets/EminemSchedule.css";
import parental from '../Images/parental.png';

export default function EminemSchedule({ day }) {
  const todaysSchedule = Schedule[day] || [];
  const [visibleLines, setVisibleLines] = useState(0);
  const [showDay, setShowDay] = useState(false)

  useEffect(() => {
    const timeou = setTimeout(() => {
      setShowDay(true)
    }, 1
    )


    // Display one line at a time with a delay
    const interval = setInterval(() => {
      setVisibleLines((prev) => (prev < todaysSchedule.length ? prev + 1 : prev));
    }, 350);

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
    <div className="eminem-outer-container">
      <div className="eminem-container">
        <div className="title-and-subtitle">
          <h1 className="eminem-title">
            MAPL<span className="backward-e">E</span>
          </h1>
          <h2 className="eminem-subtitle">THE MAPLE JIU-JITSU SHOW</h2>
        </div>

        <div className="schedule-container">
          <h2 className={`schedule-day ${showDay?'eminem-slide-in':''}`}>{day.toUpperCase()}</h2>
          <div className="schedule-classes">
            {todaysSchedule.slice(0, visibleLines).map((event, index) => (
              <div key={index} className="schedule-class">
                {event.name} - {formatTime(event.start)}
              </div>
            ))}
          </div>
        </div>

        <img className="parental" src={parental} alt="Parental Advisory" />
      </div>
    </div>
  );
}
