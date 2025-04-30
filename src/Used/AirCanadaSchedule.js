import React, { useEffect, useState } from "react";
import "../Stylesheets/AirCanadaSchedule.css";
import schedule from "../Schedule";
import aclogo from "../Images/AC_Logo_Vertical_onACBlack.jpg"

export default function AirCanadaSchedule({ day, animationDelay = 7500, animationInterval = 250 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [titleText, setTitleText] = useState("AIR CANADA"); // Initial title
  const [phase, setPhase] = useState("show8mile"); // Phases: 'show8mile', 'backspacing8mile', 'typingLocation'
    const [showDayText, setShowDayText] = useState(false);
      const [typedDay, setTypedDay] = useState(""); // For the weekday
    const [displayBoard, setDisplayBoard] = useState(false)
    const [moveLogo, setMoveLogo] = useState(false)
    const [flyPlane, setFlyPlane] = useState(false)

    useEffect(() => {
      setTimeout(() => {
        setFlyPlane(true)
      }, 7000);
          },[])
      


    useEffect(() => {
setTimeout(() => {
  setDisplayBoard(true)
}, 7000);
    },[])

    useEffect(() => {
      setTimeout(() => {
        setMoveLogo(true)
      }, 5000);
          },[])

  
  useEffect(() => {
      setTimeout(() =>{
      if (phase === "show8mile") {
        setTimeout(() => setPhase("backspacing8mile"), 500); // Pause before backspacing
      }
  
      if (phase === "backspacing8mile") {
        let text = "AIR CANADA";
        let i = text.length;
        const interval = setInterval(() => {
          setTitleText(text.substring(0, i));
          i--;
          if (i < 0) {
            clearInterval(interval);
            setTimeout(() => setPhase("typingLocation"), 1); // Pause before typing "20 Cranston Park"
          }
        }, 100); // Backspacing speed
        return () => clearInterval(interval);
      }
  
      if (phase === "typingLocation") {
        let text = "Maple Jiu-Jitsu";
        let i = 0;
        const interval = setInterval(() => {
          setTitleText(text.substring(0, i + 1));
          i++;
          if (i > text.length) {
            clearInterval(interval);
            setTimeout(() => setShowDayText(true), 500); //
           }
        }, 150); // Typing speed
        return () => clearInterval(interval);
      }}, 500)
  
      
    }, [phase]);


    useEffect(() => {
        if (showDayText) {
          let i = 0;
          const interval = setInterval(() => {
            setTypedDay(day.substring(0, i + 1));
            i++;
            if (i === day.length) clearInterval(interval);
          }, 150); // Adjust speed of typing
          return () => clearInterval(interval);
        }
      }, [showDayText, day]);

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="ac-wrapper">
      <div className={`airplane ${flyPlane? 'fly': ''}`}>✈️</div>
        <div className={`ac-image ${moveLogo? 'ac-image-move': ''}`}>
<img  src={aclogo} />
<div className="air-canada-logo">{titleText}</div>
</div>
      <h1 className="ac-title">{typedDay}</h1>
      <div className={`ac-board ${displayBoard?'':'hide-ac-board'}`}>
        <div className="ac-header">
          <span>TIME</span>
          <span>CLASS</span>
          <span>STATUS</span>
        </div>
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="ac-row">
              <div className="flip">{formatTime(cls.start)}</div>
              <div className="flip">{cls.name}</div>
              <div className="flip">ON TIME</div>
            </div>
          ) : null
        )}
      </div>
    
    </div>
  );
}
