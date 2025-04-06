import React, { useEffect, useState } from "react";
import "../Stylesheets/RolexSchedule.css";
import schedule from "../Schedule";
import RolexTypewriter from "./RolexTypewriter";

export default function RolexSchedule({ day, animationDelay = 6500, animationInterval = 700 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedDay, setTypedDay] = useState('');


  useEffect(() => {
    const word= day
    let i = 0;
    setTimeout(() => {
  const interval = setInterval(() => {
  

      setTypedDay(word.substring(0, i + 1));
      i++;
      if (i > word.length) {
        clearInterval(interval);
       }

      }, 100);

    }, 6000);

  }, []);



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
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <div className="rolex-container">
      <h1 className="rolex-title">{typedDay}</h1>
      <RolexTypewriter />
      <div className="rolex-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="rolex-class">
              <span className="rolex-class-name">{cls.name}</span>
              <span className="rolex-class-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
