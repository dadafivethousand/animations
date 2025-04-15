import React, { useEffect, useState } from "react";
import "../Stylesheets/GUnitSchedule.css";
import schedule from "../Schedule";
import gunit from "../Images/AMEv.gif"; // actual path used

export default function GUnitSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
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
    <div className="gunit-wrapper">
      <div className="gunit-bg" />
      <h1 className="gunit-title">{day.toUpperCase()}</h1>
      <div className="gunit-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="gunit-card">
              <span className="gunit-class">{cls.name}</span>
              <span className="gunit-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
      <div className="tv-frame">
        <div className="tv-screen">
          <img src={gunit} alt="G-Unit Music Video" />
        </div>
      </div>
    </div>
  );
}
