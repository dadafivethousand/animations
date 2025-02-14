 
import React, {useEffect, useState} from 'react'
import schedule from "../Schedule"
import "../Stylesheets/RastamanSchedule.css"; // Ensure correct import path

function RastamanSchedule( {day} ) {
    const [showSchedule, setShowSchedule] = useState(false);

    useEffect(() => {
      // Delay showing schedule for smooth animation
      const timeout = setTimeout(() => {
        setShowSchedule(true);
      }, 1500);
      return () => clearTimeout(timeout);
    }, []);

    const formatTime = (decimalTime) => {
        const hour = Math.floor(decimalTime);
        const minutes = Math.round((decimalTime - hour) * 60);
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const amPm = hour < 12 ? "AM" : "PM";
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hour12}:${paddedMinutes} ${amPm}`;
      };
    
  
  return (
    <div className="rastaman-container">
      {/* Multiple layers of more visible, defined smoke */}
     
      <div className="smoke smoke-3"></div>
      <div className="smoke smoke-4"></div>
      <div className="smoke smoke-5"></div>
      <div className="smoke smoke-6"></div>

            {/* Title */}
            <h1 className={`rastaman-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule */}
      <div className={`rastaman-schedule ${showSchedule ? "visible" : ""}`}>
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`rastaman-class ${showSchedule ? "slide-in" : ""}`}
              style={{ animationDelay: `${idx * 0.3}s` }}
            >
              <span className="rastaman-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default RastamanSchedule;
