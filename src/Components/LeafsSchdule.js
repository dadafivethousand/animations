import React, { useEffect, useState } from "react";
import "../Stylesheets/LeafsSchedule.css"; 
import schedule from "../Schedule";
 
function LeafsSchedule({ day }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleGames, setVisibleGames] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (showSchedule) {
      schedule[day]?.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleGames((prev) => [...prev, idx]);
        }, idx * 400); // Delay each game appearing
      });
    }
  }, [showSchedule, day]);

  // Convert time format
  const formatTime = (time) => {
    const hour = Math.floor(time);
    const minutes = Math.round((time - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="leafs-container">
 
      {/* Title */}
      <h1 className={`leafs-title ${showSchedule ? "visible" : ""}`}>
        {day}  
      </h1>

      {/* Schedule List */}
      <div className="leafs-schedule-wrapper">
        {schedule[day] &&
          schedule[day].map((game, idx) => (
            <div
              key={idx}
              className={`leafs-game ${visibleGames.includes(idx) ? "slide-in" : ""}`}
            >
              <span className="leafs-game-text">
                {game.name} - {formatTime(game.start)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default LeafsSchedule;
