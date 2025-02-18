import React, { useEffect, useState } from "react";
import schedule from "../Schedule"; // Ensure correct schedule import
import "../Stylesheets/TransformersSchedule.css"; // Link CSS file

function TransformersSchedule({ day }) {
  const [visibleClasses, setVisibleClasses] = useState([]);

  useEffect(() => {
    if (schedule[day]) {
      schedule[day].forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);
        }, idx * 350); // Staggered slide-in effect
      });
    }
  }, [day]);

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
    <div className="tf-container">
       <h2 className="tf-day">{day}</h2>

      <div className="tf-schedule">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`tf-class ${visibleClasses.includes(idx) ? "tf-slide-in" : ""}`}
            >
              {cls.name} - {formatTime(cls.start)}
            </div>
          ))}
      </div>
    </div>
  );
}

export default TransformersSchedule;
