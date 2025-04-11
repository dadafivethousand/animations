import React, { useEffect, useState } from "react";
import "../Stylesheets/StarWarsSchedule.css";
import schedule from "../Schedule"; // your schedule data

export default function StarWarsSchedule({
  day,
  animationDelay = 800,
  animationInterval = 500,
}) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
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
    <div className="sw-container">
      {/* Crossed Lightsabers at the bottom pointing up */}
      <div className="lightsaber left">
        <div className="handle"></div>
        <div className="blade green" style={{ animationDelay: "0.3s" }}></div>
      </div>
      <div className="lightsaber right">
        <div className="handle"></div>
        <div className="blade red" style={{ animationDelay: "0.6s" }}></div>
      </div>

      {/* Star Wars Font Title for the Day */}
      <h1 className="sw-title">{day.toUpperCase()}</h1>

      {/* Schedule Items */}
      <div className="sw-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="sw-class">
              <span className="sw-name">{cls.name}</span>
              <span className="sw-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
