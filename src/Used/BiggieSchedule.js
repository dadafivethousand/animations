// BiggieSchedule.jsx (refactored to show MAPLE location)
import React, { useEffect, useState } from "react";
import "./BiggieSchedule.css";
import schedule from "../RhSchedule";

function BiggieSchedule({ day, animationDelay = 2000, animationInterval = 550 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedDay, setTypedDay] = useState("");
  const [showPhoto, setShowPhoto] = useState(false);
  const [slideDown, setSlideDown] = useState(false);

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
    const t = setTimeout(() => setShowSchedule(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowPhoto(true), 3000);
    const t2 = setTimeout(() => setSlideDown(true), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (!showSchedule) return;
    const entries = schedule[day] || [];
    let cancelled = false;
    (async function reveal() {
      for (let idx = 0; idx < entries.length && !cancelled; idx++) {
        await new Promise((res) => setTimeout(res, animationInterval));
        if (!cancelled) setVisibleArray((prev) => [...prev, idx]);
      }
    })();
    return () => { cancelled = true; };
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="biggie-container">
      <div className={`biggie-photo ${showPhoto ? "biggie-show" : ""} ${slideDown ? "slideDown" : ""}`} />
      <div className="biggie-header">
        <h1 className="biggie-day">{typedDay}</h1>
      </div>

      <div className="biggie-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="biggie-class">
              <div className="biggie-left">
                <span className="biggie-class-name">{cls.name}</span>
                {cls.maple && (
                  <span className="biggie-maple">
                    <span className="biggie-pin" aria-hidden>📍</span>
                    MAPLE
                  </span>
                )}
              </div>
              <span className="biggie-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default BiggieSchedule;  