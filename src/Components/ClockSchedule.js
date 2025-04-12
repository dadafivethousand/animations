import React, { useEffect, useState } from "react";
import "../Stylesheets/ClockSchedule.css";
import schedule from "../Schedule"; // your schedule data

function ClockSchedule({ day, animationDelay = 2000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    // 1) Type out the 'day' string after 'animationDelay'
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) {
          clearInterval(interval);
        }
      }, 100);
    }, animationDelay);
  }, [day, animationDelay]);

  useEffect(() => {
    // 2) After typing finishes, wait 2s more, then show schedule
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay + 2000);
  }, [animationDelay]);

  useEffect(() => {
    // 3) Once showSchedule is true, flip in each schedule item in intervals
    if (showSchedule) {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }
  }, [showSchedule, day, animationInterval]);

  // Helper to format time from a decimal (e.g. 13.5 => "1:30 PM")
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="clock-container">
      {/* Day of the week "typing" in a flip-clock minimalist style */}
      <div className="clock-day">{displayDay}</div>

      {/* Schedule with Flip Panels */}
      <div className="clock-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <FlipItem
              key={idx}
              className={cls.name}
              time={formatTime(cls.start)}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

/** 
 * A single schedule item rendered as a "Flip Clock" panel.
 * We flip from blank to show "Class Name" (top line) 
 * and "Time" (bottom line).
 */
function FlipItem({ className, time }) {
  return (
    <div className="flip-item">
      {/* Top half flips down, bottom half flips up */}
      <div className="flip-panel top">
        <div className="flip-content">{className}</div>
      </div>
      <div className="flip-panel bottom">
        <div className="flip-content">{time}</div>
      </div>
    </div>
  );
}

export default ClockSchedule;
