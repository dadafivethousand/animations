import React from "react";
import schedule from "../Schedule";
import "../Stylesheets/GTASchedule.css"; // GTA-styled CSS import

const formatTime = (time) => {
  const hours = Math.floor(time);
  const minutes = (time % 1) * 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes === 0 ? "00" : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const GtaSchedule = ({ day }) => {
  const classes = schedule[day] || [];

  return (
    <div className="gta-container">
      <div className="gta-title">
        <span>MAPLE</span>
        <span>JIU-JITSU</span>
      </div>
      <h2 className="gta-day-title">{day}</h2>
      <div className="gta-class-grid">
        {classes.map((cls, index) => (
          <div key={index} className={`gta-class gta-box-${index % 6}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <span className="gta-class-name">{cls.name}</span>
            <span className="gta-class-time">
              {formatTime(cls.start)} - {formatTime(cls.end)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GtaSchedule;
