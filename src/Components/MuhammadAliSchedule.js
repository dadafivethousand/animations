import React, { useEffect, useState } from "react";
import schedule from "../Schedule"; // Ensure correct schedule import
import "../Stylesheets/MuhammadAliSchedule.css"; // Link CSS file

function MuhammadAliSchedule({ day }) {
  const [punchedClasses, setPunchedClasses] = useState([]);
  const [currentPunch, setCurrentPunch] = useState(null);

  useEffect(() => {
    if (schedule[day]) {
      schedule[day].forEach((_, idx) => {
        setTimeout(() => {
          setCurrentPunch(idx); // Move glove to position
          setTimeout(() => {
            setPunchedClasses((prev) => [...prev, idx]); // Reveal text AFTER impact
            setTimeout(() => {
              setCurrentPunch(null); // Glove retracts for realism
            }, 1000); // Hold impact longer for weight
          }, 600); // Short pause after punch lands
        }, idx * 3000); // Stagger punches for dramatic effect
      });
    }
  }, [day]);

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
    <div className="ali-container">
      <div className="ali-schedule">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div key={idx} className="ali-class-container">
              {/* Boxing Glove with Full Fist */}
              {idx === currentPunch && <div className="ali-glove"></div>}

              {/* Blank Schedule Box That Reveals Info After Punch */}
              <div className={`ali-class ${punchedClasses.includes(idx) ? "ali-show" : ""}`}>
                <span className="ali-class-name">{cls.name}</span>
                <span className="ali-class-time">{formatTime(cls.start)}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MuhammadAliSchedule;
