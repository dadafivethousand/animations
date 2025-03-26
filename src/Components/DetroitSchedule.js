import React, { useEffect, useState } from "react";
import "../Stylesheets/DetroitSchedule.css";
import schedule from "../Schedule";

function DetroitSchedule({ day, animationDelay = 3000, animationInterval = 450 }) {
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
    }, 80);
}, 2000);
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
    <div className="detroit-container">
      <div className="detroit-header">
        <h1 className="detroit-day">{typedDay}</h1>
      </div>

      <div className="detroit-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="detroit-class">
              <span className="detroit-class-name">{cls.name}</span>
              <span className="detroit-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default DetroitSchedule;
