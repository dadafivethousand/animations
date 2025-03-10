import React, { useEffect, useState } from "react";
import "../Stylesheets/LilBabySchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists
import lilbaby from '../Images/Harder_Than_Ever.jpg'

function LilBabySchedule({ day, animationDelay = 2000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
     const [typedText, setTypedText] = useState("");
        const [showText, setShowText] = useState(false);
 
  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

    useEffect(() => {
        // Start the typewriter effect once the animation is fully done (7s + small buffer)
        setTimeout(() => {
          setShowText(true);
        }, 1000);
        if (showText) {
          let i = 0;
          const interval = setInterval(() => {
            setTypedText(day.substring(0, i + 1));
            i++;
            if (i === day.length) clearInterval(interval);
          }, 150); // Adjust speed of typing
          return () => clearInterval(interval);
        }
      }, [showText]);

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
    <div className="lilbaby-container">
      {/* Title in 8 Mile style */}
 

      {/* Schedule */}
      <div className="lilbaby-schedule">
        <h2 className="lilbaby-day">{day}</h2>

        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="lilbaby-class">
              <span className="lilbaby-class-name">{cls.name}</span>
              <span className="lilbaby-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default LilBabySchedule;
