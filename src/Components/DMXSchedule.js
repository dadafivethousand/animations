import React, { useEffect, useState } from "react";
import "../Stylesheets/DMXSchedule.css";
import schedule from "../Schedule";

function DMXSchedule({ day, animationDelay = 500, animationInterval = 300 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedDay, setTypedDay] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedDay(day.substring(0, i + 1));
      i++;
      if (i > day.length) clearInterval(interval);
    }, 80);
  }, [day]);

  useEffect(() => {
    setTimeout(() => setShowSchedule(true), animationDelay);
  }, [animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, idx * animationInterval);
    });
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <div className="dmx-container">
      <div className="dmx-header">
        <h1 className="dmx-day">{typedDay}</h1>
      </div>

      <div className="dmx-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="dmx-class">
              <span className="dmx-class-name">{cls.name}</span>
              <span className="dmx-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default DMXSchedule;
