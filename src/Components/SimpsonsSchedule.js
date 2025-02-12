import React, { useEffect, useState } from "react";
import "../Stylesheets/SimpsonsSchedule.css";
import schedule from "../Schedule";

function SimpsonsSchedule({ day }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setStartAnimation(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  // Convert decimal hours to AM/PM format
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="simpsons-container">
      <div className="simpsons-cloud-group simpsons-left">
        <div className="simpsons-cloud-balls">
          <div className="simpsons-cloud-ball"></div>
          <div className="simpsons-cloud-ball"></div>
          <div className="simpsons-cloud-ball"></div>
          <div className="simpsons-cloud-ball"></div>
        </div>
      </div>

      <div className="simpsons-cloud-group simpsons-left">
        <div className="simpsons-cloud-balls">
        <div className="simpsons-cloud-ball"></div>
        <div className="simpsons-cloud-ball"></div>
        <div className="simpsons-cloud-ball"></div>
        <div className="simpsons-cloud-ball"></div>
          
         </div>
         
      </div>
    </div> 
  );
}

export default SimpsonsSchedule;
