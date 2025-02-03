import React from "react";
import schedule from "../Schedule";
import "../Stylesheets/WolverineSchedule.css";
import { useState, useEffect } from "react";

function WolverineSchedule({ day }) {
  const[slash, setSlash] = useState(false)
  const classesForDay = schedule[day] || [];

  useEffect(() => {
    const startSlash=setTimeout(()=>{
      console.log('slashing time')
      setSlash(true)
    },3000)
  },[])

  // Convert decimal hours -> "7:30 AM"
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="wolverine-schedule-container deadpool-theme">
      {/* Day heading + bullet holes */}
      <h1 className="day-of-week">
        {day}
        <>
          <span className="bulletHole hole1"></span>
          <span className="bulletHole hole2"></span>
          <span className="bulletHole hole3"></span>
          <span className="bulletHole hole4"></span>
          <span className="bulletHole hole5"></span>
          <span className="bulletHole hole6"></span>
        </>
      </h1>

      {/* Classes float up after bullet holes finish */}
      <div className="wolverine-classes-list">
        {classesForDay.map((cls, idx) => (
          <div className="wolverine-class-item-outer">
          <div
            className="wolverine-class-item float-up"
            key={idx}
            style={{ animationDelay: `${1.4 + idx * 0.2}s` }}
          >
            {/* The actual text */}
            <div className="class-name">{cls.name}</div>
            <div className="class-time">{formatTime(cls.start)}</div>

            {/* 3 claws that pop out from the top edge, angled downward */}
         
          </div>
          <div className={`claws-container left-claws ${slash? 'show-left' : ''}` }>
              
              <div className="claw claw1"></div>
              <div className="claw claw2"></div>
              <div className="claw claw3"></div>
       
          
            </div>
            <div className={`claws-container right-claws ${slash? 'show-right' : ''}` }>
    
              <div className="claw claw1"></div>
              <div className="claw claw2"></div>
              <div className="claw claw3"></div>
          
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WolverineSchedule;
