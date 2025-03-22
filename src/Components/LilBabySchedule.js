import React, { useEffect, useState } from "react";
import "../Stylesheets/LilBabySchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists
import lilbaby from '../Images/Harder_Than_Ever.jpg'

function LilBabySchedule({ day, animationDelay = 1000, secondaryAnimationDelay=5000, thirdAnimationDelay=7000,animationInterval = 500 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
     const [typedText, setTypedText] = useState("");
        const [showText, setShowText] = useState(false);
        const [titleText, setTitleText] = useState('')
        const [displayday, setDisplayday] = useState('')
 
  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, thirdAnimationDelay);
  }, [ ]);

  useEffect(() => {
    setTimeout(() => {
      let text = "maple jiu-jitsu goes";
       let i = 0;
       const interval = setInterval(() => {
         setTitleText(text.substring(0, i + 1));
         i++;
         if (i > text.length) {
           clearInterval(interval);
          }
       }, 150); // Typing speed
       return () => clearInterval(interval);
     }, animationDelay)

     setTimeout(() => {
  
       let i = 0;
       const interval = setInterval(() => {
         setDisplayday(day.substring(0, i + 1));
         i++;
         if (i > day.length) {
           clearInterval(interval);
          }
       }, 150); // Typing speed
       return () => clearInterval(interval);
     }, secondaryAnimationDelay)
    
    }
     ,[])
 

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
      <div className="lilbaby-album-cover">
        <div className="harder-text">{titleText}</div>
        

      </div>
 

      {/* Schedule */}
      <div className="lilbaby-schedule">
        <h2 className="lilbaby-day">{displayday}</h2>

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
