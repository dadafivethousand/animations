import React, { useEffect, useState } from "react";
import "../Stylesheets/MonsterSchedule.css";
import schedule from "../Schedule"; // Assuming schedule data exists
import monster from '../Images/monsterlogo.png'

function MonsterSchedule({ day, animationDelay = 4500, animationInterval = 250 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
     const [typedText, setTypedText] = useState("");
     const [moveDown, setMoveDown] = useState(false)
 
        const [showText, setShowText] = useState(false);
        const text = 'aple Jiu Jitsu'
 


  
      useEffect(() => {
          // Start the typewriter effect once the animation is fully done (7s + small buffer)
          setTimeout(() => {
            setShowText(true);
          }, 2000);
          if (showText) {
            let i = 0;
            const interval = setInterval(() => {
              setTypedText(text.substring(0, i + 1));
              i++;
              if (i === text.length) clearInterval(interval);
            }, 100); // Adjust speed of typing
            return () => clearInterval(interval);
          }
        }, [showText]);


  useEffect(() => {
    setTimeout(() => {
      setMoveDown(true);
    }, 100);
  }, [ ]);

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

 

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="monster-container">
      <div className="monster-background"></div>
      
      {showSchedule ?
      <div 
        className="monster-tv" 
       >
        <div className="monster-day glitch-effect"><img id='small-logo' src={monster} />onday</div>
 
          {schedule[day]?.map((cls, idx) => (
            visibleArray.includes(idx) && (
              <div key={idx} className={`monster-class monster-class-${idx % 3} lightning`}>
                <span className="monster-class-name">{cls.name}</span>
                <span className="monster-class-time">{formatTime(cls.start)}</span>
              </div>
            )
          ))}
    
      </div>
      : 
      <div className={`monster-logo ${ moveDown? 'move-down':''}`}><img className="monster-logo-image" src={monster}/> <p class="monster-text"> {typedText} </p></div>
      }
    </div>
  );
}

export default MonsterSchedule;
