import React from "react";
import schedule from "../RhSchedule";
import "./GTASchedule.css"; // Correct import
import gta from '../Images/Used/gta.webp'
import rockstar from '../Images/Used/unnamed.png'
import { useState, useEffect } from "react";
const formatTime = (time) => {
  const hours = Math.floor(time);
  const minutes = (time % 1) * 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes === 0 ? "00" : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};



const GtaSchedule = ({ day }) => {
  const [fade, setFade] = useState(false)
  useEffect(()=>{
    const fade = setTimeout( () => {setFade(true)}, 1000)
  
  }, [])
  const classes = schedule[day] || [];

  return (
    <div className="gta-container">
      <div className={`rockstar-background ${fade ? 'fade' : ''}`}>
      <img className='rockstar' src={rockstar}/>
      </div>
   <div className="gta-title">
      <h2 className="line1">{day}</h2>
      </div>
      <div className="gta-class-list">
        {classes.map((cls, index) => (
          <div key={index} className="gta-class">
            <span className="gta-class-name">{cls.name}</span> - <span className="gta-class-time">
              {formatTime(cls.start)}  
            </span>
          </div>
        ))}
      </div>
      <div className="gta"></div>
    </div>
  );
};

export default GtaSchedule;
