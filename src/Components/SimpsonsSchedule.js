import React, { useEffect, useState } from "react";
import "../Stylesheets/SimpsonsSchedule.css";
import schedule from "../Schedule";

function SimpsonsSchedule({ day }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setStartAnimation(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setShowTitle(true);
    }, 3300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setShowTitle(false);
      
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setShowSchedule(true);
      
    }, 9000);
    return () => clearTimeout(timeout);
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
    <div className="simpsons-container">
      <div className={`simpsons-cloud-group ${startAnimation ? 'simpsons-left' : ''}`}>
        <div className="simpsons-cloud-balls">
          <div className="simpsons-cloud-ball"></div>
          <div className="simpsons-cloud-ball"></div>
          <div className="simpsons-cloud-ball"></div>
          <div className="simpsons-cloud-ball"></div>
        </div>
      </div>

      <div className={`simpsons-cloud-group ${startAnimation ? 'simpsons-right' : ''}`}>
        <div className="simpsons-cloud-balls">
        <div className="simpsons-cloud-ball"></div>
        <div className="simpsons-cloud-ball"></div>
        <div className="simpsons-cloud-ball"></div>
        <div className="simpsons-cloud-ball"></div>
          
         </div>
         
      </div>

      <h1 className={`simpsons-title ${showTitle? 'simpsons-animate-title' : ''}`}>
        Maple <br></br>Jiu-Jitsu
      </h1>

<div className={`simpsons-schedule ${showSchedule? 'simpsons-visible':''}`}>
      <h1 className={`simpsons-day ${showSchedule ? "shake" : ""}`}>{day}</h1>

{/* SMASHING Class Names */}
<div className="simpsons-classes">
  {schedule[day] &&
    schedule[day].map((cls, idx) => (
      <div
        key={idx}
        className={`simpsons-class ${showSchedule ? "smash-in" : ""}`}
        style={{ animationDelay: `${idx * 0.3}s` }}
      >
        <span className="class-text">
          {cls.name} - {formatTime(cls.start)}
        </span>

      </div>
    ))}
</div>
    </div> 
    </div>
  );
}

export default SimpsonsSchedule;
