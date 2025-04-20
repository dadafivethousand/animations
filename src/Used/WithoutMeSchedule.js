import React, { useEffect, useState } from "react";
import "../Stylesheets/WithoutMeSchedule.css";
import schedule from "../Schedule";
import firstGif from "../Images/_ (1).gif"
import secondGif from "../Images/_ (2).gif"
import thirdGif from "../Images/2014-03-24-shade-thumb_gif (400×300).gif"
import fourthGif from "../Images/Register - Login.gif"

export default function WithoutMeSchedule({ day, animationDelay = 2500, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);

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
    <div className="withoutme-container">
        <div className="withoutme-collage"> 
        <img className="third-gif" src={thirdGif}/>
          <img className="second-gif" src={secondGif}/>
   
          <img className="fourth-gif" src={fourthGif}/>
  
        </div>
      <h1 className="withoutme-title">{day.toUpperCase()}</h1>
      <div className="withoutme-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="comic-class">
              <span className="comic-name">{cls.name}</span>
              <span className="comic-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
