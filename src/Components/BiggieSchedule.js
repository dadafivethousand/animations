import React, { useEffect, useState } from "react";
import "../Stylesheets/BiggieSchedule.css";
import schedule from "../Schedule";

function BiggieSchedule({ day, animationDelay = 2000, animationInterval = 550 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedDay, setTypedDay] = useState("");

  useEffect(() => {
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedDay(day.substring(0, i + 1));
        i++;
        if (i > day.length) clearInterval(interval);
      }, 120);
    }, 1000);
  }, [day]);

  useEffect(() => {
    setTimeout(() => setShowSchedule(true), animationDelay);
  }, [animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;
    const entries = schedule[day] || [];
    (async function reveal() {
      for (let idx = 0; idx < entries.length; idx++) {
        await new Promise((res) => setTimeout(res, animationInterval));
        setVisibleArray((prev) => [...prev, idx]);
      }
    })();
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <div className="biggie-container">
      <div className="biggie-header">
        <h1 className="biggie-day">{typedDay}</h1>
      </div>

      <div className="biggie-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="biggie-class">
              <span className="biggie-class-name">{cls.name}</span>
              <span className="biggie-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default BiggieSchedule;
