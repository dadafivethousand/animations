// TransformersSchedule.js
import React, { useEffect, useState } from "react";
import schedule from "../RhSchedule";
import "./TransformersSchedule.css";

function TransformersSchedule({ day }) {
  const [visibleClasses, setVisibleClasses] = useState([]);

  useEffect(() => {
    setVisibleClasses([]);
    const timers = [];
    const items = schedule[day] || [];
    items.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleClasses((prev) => [...prev, idx]);
      }, idx * 400);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="tf-container">
      <h2 className="tf-day">{day}</h2>

      <div className="tf-schedule">
        {(schedule[day] || []).map((cls, idx) => (
          <div
            key={idx}
            className={`tf-class ${visibleClasses.includes(idx) ? "tf-slide-in" : ""}`}
          >
            {/* glitchy border pieces */}
            <span className="tf-border-top" />
            <span className="tf-border-bottom" />
            <span className="tf-border-left" />
            <span className="tf-border-right" />

            {/* left: name + maple badge (kept INSIDE the class) */}
            <div className="tf-left">
              <span className="tf-name">{cls.name}</span>
              {cls.maple && <span className="tf-badge tf-badge--maple">📍 Maple</span>}
            </div>

            {/* right: time */}
            <span className="tf-time">{formatTime(cls.start)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransformersSchedule;
