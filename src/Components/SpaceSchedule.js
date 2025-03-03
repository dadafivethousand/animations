import React, { useEffect, useState } from "react";
import "../Stylesheets/SpaceSchedule.css";
import schedule from "../Schedule";

function SpaceSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [spaceship, setSpaceship] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 2000); // Show schedule after reaching space
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setSpaceship(true);
    }, 5000); // Show schedule after reaching space
  }, []);

  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;
setTimeout(() => {
  

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]); // Add index one by one
        }, idx * 500); // Delay each entry by 500ms
      });
    }, 2000);
    }
  }, [showSchedule, day]);

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
    <div className={`space-container space-mode`}>
      <div className="space-content">
        {showSchedule && <div className="earth">🌍</div>}

        <div className={`space-ship ${spaceship? 'space-ship-fly':''}`}>
        🚀
        </div>

        {showSchedule && (
          <div className="space-classes">
            <h1 className="space-title">{day}</h1>
            {schedule[day]?.map((cls, idx) => (
              visibleArray.includes(idx) && (
                <div key={idx} className="space-class">
                  <span className="space-class-name">{cls.name}</span> -{" "}
                  <span className="space-class-time">{formatTime(cls.start)}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpaceSchedule;
