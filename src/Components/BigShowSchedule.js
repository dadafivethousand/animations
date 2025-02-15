import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/BigShowSchedule.css"; // Ensure correct import path
import wwe_logo from '../Images/WWE_Logo.svg'

function BigShowSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [ringImpact, setRingImpact] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true);
    }, 2000);
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 5000);
  }, []);

  useEffect(() => {
    if (showSchedule) {
      schedule[day]?.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);

          // Last class SLAMS the ring
          if (idx === schedule[day].length - 1) {
            setTimeout(() => {
              setRingImpact(true);
              setTimeout(() => setRingImpact(false), 300);
            }, 800);
          }
        }, idx * 400);
      });
    }
  }, [showSchedule, day]);

  // Convert decimal time to 12-hour format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className={`bigshow-container ${ringImpact ? "ring-shake" : ""}`}>

      <img className={`${startAnimation? 'shrink-rotate' : ''}`} src={wwe_logo} />

      
      {/* Arena Lighting */}
 
      {/* Day Title */}
      <h1 className={`bigshow-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>



      {/* Schedule */}
      <div className="bigshow-schedule-wrapper">

        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`bigshow-class ${visibleClasses.includes(idx) ? "rise-up" : ""}`}
            >
              <span className="bigshow-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default BigShowSchedule;
