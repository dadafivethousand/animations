import React, { useEffect, useState } from "react";
import "../Stylesheets/BJJSchedule.css";
import schedule from "../Schedule";
import brazillianflag from "../Images/Flag of Brazil _ History, Meaning & Design _ Britannica.jpeg";

export default function BJJSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
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
    <div className="bjj-wrapper">
      <div className="bjj-flag">
        <img src={brazillianflag} alt="Brazil Flag" />
      </div>
      <h1 className="bjj-title">{day.toUpperCase()}</h1>
      <div className="bjj-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className={`belt-card belt-${idx % 6}`}>
              <span className="belt-class">{cls.name}</span>
              <span className="belt-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
