import React, { useEffect, useState } from "react";
import "../Stylesheets/KhabibSchedule.css";
import schedule from "../Schedule";

function KhabibSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 500);
  }, []);

  // Convert decimal hours to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="khabib-container">
      <h1 className="khabib-title">{day}</h1>

      <div className="khabib-classes">
        {showSchedule &&
          schedule[day]?.map((cls, idx) => (
            <div
              key={idx}
              className="khabib-class"
              style={{ animationDelay: `${idx * 0.3}s` }}
            >
              <div className="papakha-hat"></div>
              <div className="khabib-class-content">
                <div className="khabib-class-name">{cls.name}</div>
                <div className="khabib-class-time">{formatTime(cls.start)}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default KhabibSchedule;
