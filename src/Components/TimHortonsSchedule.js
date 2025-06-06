import React, { useEffect, useState } from "react";
import "../Stylesheets/TimHortonsSchedule.css";
import schedule from "../Schedule";
import timhortons from "../Images/timhortons.png"
import Typewriter from "../Utils/utils";

export default function TimHortonsSchedule({ day, animationDelay = 1300, animationInterval = 150 }) {
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
        <div className="tim-outer-container">
      <div className="lid"></div>
    <div className="tim-container">
              <img className="tim-hortons" src={timhortons}/>
              
      <h1 className="tim-header">  <Typewriter text="Saturday"/>  </h1>
      <div className="tim-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="tim-class-container">
            {visibleArray.includes(idx) && (
              <div className={`tim-class class-${idx}`}>
                <div>
                <span className="tim-class-name">{cls.name}</span> <br></br> 
                {idx==0?<div className="tim-class-disclaimer">  <Typewriter typingSpeed="200" text="At 132 King Rd" />  </div> :''} 
                             {idx==1?<div className="tim-class-disclaimer">  <Typewriter typingSpeed="200" text="Regular Location" />  </div> :''} 
               
               </div>
                <span className="tim-class-time">{formatTime(cls.start)}</span><br></br> 
      
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
    </div>
  );
}
