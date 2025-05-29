import React, { useEffect, useState } from "react";
import "../Stylesheets/VegasSchedule.css";
import schedule from "../Schedule";

export default function VegasSchedule({ day, animationDelay = 800, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const entries = schedule[day] || [];
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      entries.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }, animationDelay);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="vegas-wrapper">
      <h1 className="vegas-title">🎰 VEGAS SCHEDULE — {day}</h1>

      <div className={`slot-machine ${spinning ? "spinning" : ""}`}>
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="slot-result" style={{ animationDelay: `${idx * 0.2}s` }}>
              <div className="slot-window">
                <div className="slot-label">
                  <span className="slot-time">{formatTime(cls.start)}</span>
                  <span className="slot-name">{cls.name}</span>
                </div>
              </div>
            </div>
          ) : (
            <div key={idx} className="slot-result placeholder" />
          )
        )}
      </div>
    </div>
  );
}
