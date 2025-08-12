import React, { useEffect, useState } from "react";
import "./StreetFighterSchedule.css";
import schedule from "../RhSchedule";
import streetFighter from "../Images/Used/13199.gif";

export default function StreetFighterSchedule({
  day,
  animationDelay = 1500,
  animationInterval = 300,
}) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setVisibleArray([]);
    const timers = [];
    const classes = schedule[day] || [];

    classes.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="sf-wrapper">
      <h1 className="sf-title">{day.toUpperCase()}</h1>

      <div className="sf-gif">
        <img src={streetFighter} alt="Street Fighter animation" />
      </div>

      <div className="sf-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="sf-card-wrap">
              <div className="sf-card">
                <span className="sf-class">{cls.name}</span>
                <span className="sf-time">{formatTime(cls.start)}</span>
              </div>
              {cls.maple && <div className="sf-maple-row">📍 Maple Location</div>}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
