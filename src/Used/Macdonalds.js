import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/Macdonalds.css"; // Ensure CSS is linked
import logo from '../Images/McDonalds-Logo.wine.png'

function McDonaldsSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false)
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "aple Jiu-Jitsu"; // Text for typewriter effect


  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true);
    }, 2000);
  }, []);

  useEffect(() => {
    // Start the typewriter effect once the animation is fully done (7s + small buffer)
    setTimeout(() => {
      setShowText(true);
    }, 7000);

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
    setTimeout(() => {
      setShowSchedule(true);
    }, 8000);
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
    <div className="mcd-container">
      {/* McDonald's Logo with Golden Arch */}
      <div className={`mcd-logo ${startAnimation? 'mcd-animation':''}`}>
        <div className="golden-arch"> <img src={logo}/> </div>
        <span className={`mcd-text ${showText ? "visible" : ""}`}>
        {typedText}
      </span>    
        </div>
<div className="title-and-weekday">
      {/* Title Section */}
      <h1 className={`mcd-title ${showSchedule ? "visible" : ""}`}>
        {day}
      </h1>

      {/* Schedule Section */}
      <div className={`mcd-schedule ${showSchedule ? "visible" : ""}`}>
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div key={idx} className={`mcd-class ${showSchedule ? "fade-in" : ""}`}>
              <span className="mcd-class-text">
                {cls.name} - {formatTime(cls.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
    </div>
  );
}

export default McDonaldsSchedule;
