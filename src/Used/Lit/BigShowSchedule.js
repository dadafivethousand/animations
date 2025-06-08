import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "./BigShowSchedule.css"; 
import wwe_logo from '../Images/WWE_Logo.svg';

function BigShowSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [ringImpact, setRingImpact] = useState(false);
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [startAnimation, setStartAnimation] = useState(false);
    const [typedText, setTypedText] = useState("");
      const [showText, setShowText] = useState(false);
      const fullText = "aple Jiu-Jitsu"; // Text for typewriter effect

    
  

  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true);
    }, 1500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 6000);
  }, []);

  useEffect(() => {
      // Start the typewriter effect once the animation is fully done (7s + small buffer)
      setTimeout(() => {
        setShowText(true);
      }, 3000);
      if (showText) {
        let i = 0;
        const interval = setInterval(() => {
          setTypedText(fullText.substring(0, i + 1));
          i++;
          if (i === fullText.length) clearInterval(interval);
        }, 150); // Adjust speed of typing
        return () => clearInterval(interval);
      }
    }, [showText]);

  useEffect(() => {
    if (showSchedule) {
      schedule[day]?.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleClasses((prev) => [...prev, idx]);

          // Make each class slam onto the screen
          setRingImpact(true);
          setTimeout(() => setRingImpact(false), 200);

          // Last class has the strongest slam
      
        }, idx * 600); // Each class slams with a slight delay
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
     <div className="image-container">
      <img className={`${startAnimation ? 'shrink-rotate' : ''}`} src={wwe_logo} alt="WWE Logo" />
   
      <div className="typewriter">
      {typedText}
      </div>
      </div>
      {/* Arena Lighting */}
      <h1 className={`bigshow-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule */}
      <div className="bigshow-schedule-wrapper">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`bigshow-class ${visibleClasses.includes(idx) ? "slam-in" : ""} 
 `}
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
