import React, { useEffect, useState } from "react";
import "../Stylesheets/TheBigShowSchedule.css";
import schedule from "../Schedule";

export default function TheBigShowSchedule({ day, animationDelay = 300, animationInterval = 200 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="thebigshow-container">
      <h1 className="thebigshow-header">{day.toUpperCase()}</h1>
      <div className="thebigshow-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="thebigshow-class-container">
            {visibleArray.includes(idx) && (
              <div className="thebigshow-class">
                <span className="thebigshow-class-name">{cls.name}</span>
                <span className="thebigshow-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
 
     <div className="thebigshow-gif-container">
 <img
  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjJ0ZzU0anE2MmYxdnQyc3JkNXJlNWM3czJyNWR2Z2dnamZvZThqYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S6ptnsaiM2S4/giphy.gif"
  alt="Big Show Entrance"
  className="bigshow-gif"
/>

</div>

    </div>
  );
}
