import React, { useEffect, useState } from "react";
import "./SouthParkSchedule.css";
import schedule from "../RhSchedule"; // Assuming schedule data exists
import southParkImage from "../Images/Used/Trending GIF eric cartman stan marsh kyle broflovski south park kenny mccormick unsure question unknown who are you.gif"

function SouthParkSchedule({ day, animationDelay = 1000, animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

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

  // Function to convert decimal time to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="southpark-container">
      <div className="southpark-schedule-box">
        <h1 className="southpark-day">{day.toUpperCase()}</h1>
        <div className="southpark-schedule">
          {schedule[day]?.map((cls, idx) => (
            visibleArray.includes(idx) && (
              <div key={idx} className="southpark-class animated-entry">
                <div> 
                <span className="southpark-class-name">{cls.name}</span> <br></br>
                          <span className="southpark-maple southpark-class-name ">{cls.maple && '📍 Maple Location'}</span>
                                   </div>
                <span className="southpark-class-time">{formatTime(cls.start)}</span>
              </div>
     
            )
          ))}
        </div>
      </div>
      <img className="southpark-image" src={southParkImage}/>
    </div>
  );
}

export default SouthParkSchedule;
