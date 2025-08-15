import React, { useEffect, useState } from "react";
import "./BadBoysSchedule.css";
import schedule from "../RhSchedule";

function BadBoysSchedule({ day, animationDelay = 1200, animationInterval = 400 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [displayDay, setDisplayDay] = useState([]);

  useEffect(() => {
    // reset on day change
    setShowSchedule(false);
    setVisibleArray([]);
    setDisplayDay([]);
    const timers = [];

    // type out the day
    const startType = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) clearInterval(interval);
      }, 90);
      timers.push(interval);
    }, animationDelay);
    timers.push(startType);

    // reveal schedule after the title animation
    const showT = setTimeout(() => setShowSchedule(true), animationDelay + 1200);
    timers.push(showT);

    return () => timers.forEach((t) => clearTimeout(t));
  }, [day, animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;
    const timers = [];
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, idx * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="badboys-container">
      <div className="badboys-day">{displayDay}</div>

      <div className="badboys-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="badboys-card-wrap" key={idx}>
              <div className="badboys-class">
                <span className="badboys-class-name">{cls.name}</span>
                   {cls.maple && (
                <div className="badboys-maple">📍 MAPLE LOCATION</div>
              )}
                <span className="badboys-class-time">{formatTime(cls.start)}</span>
              </div>

              {/* Maple location plaque under the card */}
           
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default BadBoysSchedule;
