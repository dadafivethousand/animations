import React, { useEffect, useState } from "react";
import "../Stylesheets/SimpsonsSchedule.css";
import schedule from "../Schedule";
import CloudContainer from "./Cloud";

function SimpsonsSchedule({ day }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false)

  useEffect(()=>{
    setStartAnimation(true)
  })



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
 

 
    </div>
  );
}

export default SimpsonsSchedule;
