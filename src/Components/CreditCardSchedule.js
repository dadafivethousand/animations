import React, { useEffect, useState } from "react";
import "../Stylesheets/CreditCardSchedule.css";
import schedule from "../Schedule";

export default function CreditCardSchedule({ day, animationDelay = 1000, animationInterval = 350 }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    setVisible([]);
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="creditcard-container">
      <div className="creditcard-card">
        <h1 className="creditcard-day">{day.toUpperCase()}</h1>
        <div className="creditcard-track">
          {schedule[day]?.map((cls, idx) =>
            visible.includes(idx) ? (
              <div key={idx} className="creditcard-class">
                <span className="creditcard-name">{cls.name}</span>
                <span className="creditcard-time">{formatTime(cls.start)}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
