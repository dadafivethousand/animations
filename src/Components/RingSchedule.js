import React, { useEffect, useState } from "react";
import "../Stylesheets/RingSchedule.css";
import schedule from "../Schedule";
import ringImage from "../Images/Ring1-700x480.jpg"

function RingSchedule({ day }) {
  const [showStatic, setShowStatic] = useState(true);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    const staticTimer = setTimeout(() => {
      setShowStatic(false);
      setDisplayDay(day); // Instant display after static
    }, 2500); // show static for 2.5s

    return () => clearTimeout(staticTimer);
  }, [day]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className={`ring-container ${showStatic ? "static" : ""}`}>
      {showStatic ? (
        <div className="static-overlay" />
      ) : (
        <>
                <img src={ringImage} alt="ring" />
       
          <div className="ring-day">{displayDay}</div>
          <div className="ring-schedule">
            {(schedule[day] || []).map((cls, idx) => (
              <div className="ring-class" key={idx}>
                <span className="ring-name">{cls.name}</span>
                <span className="ring-time">{formatTime(cls.start)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RingSchedule;
