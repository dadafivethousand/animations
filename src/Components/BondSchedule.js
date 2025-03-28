import React, { useEffect, useState } from "react";
import "../Stylesheets/BondSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists

function BondSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [titleText, setTitleText] = useState("");
  const [displayDay, setDisplayDay] = useState("");

  useEffect(() => {
    setTimeout(() => {
      let text = "Bond's Mission Schedule";
      let i = 0;
      const interval = setInterval(() => {
        setTitleText(text.substring(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(interval);
        }
      }, 150);
    }, animationDelay);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) {
          clearInterval(interval);
        }
      }, 150);
    }, animationDelay + 2000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay + 4000);
  }, []);

  useEffect(() => {
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

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="bond-container">
 
      {/* Schedule */}
      <div className="bond-schedule">
        <h2 className="bond-day">{displayDay}</h2>

        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="bond-class">
              <span className="bond-class-name">{cls.name}</span>
              <span className="bond-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default BondSchedule;
