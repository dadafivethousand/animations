import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/MafiaSchedule.css";

export default function MafiaSchedule({ day, animationDelay = 1000, animationInterval = 400 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [screenShots, setScreenShots] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];

    // Fade in class cards one by one
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });

    // After all classes are visible, trigger bullet holes
     setTimeout(() => {
      const numShots = Math.floor(Math.random() * 17) + 32; // 32–48
      const holes = [];

      for (let i = 0; i < numShots; i++) {
        holes.push({
          id: `screen-hole-${i}`,
          top: Math.random() * 90 + 5,
          left: Math.random() * 90 + 5,
          delay: i * 100, // stagger bullet shots
        });
      }

      setScreenShots(holes);
    }, animationDelay + classes.length * animationInterval + 2600);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const classes = schedule[day] || [];

  return (
    <div className="mafia-container">
      <h1 className="mafia-day">{day}</h1>

      <div className="mafia-classes">
        {classes.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              className="mafia-class-card"
              key={idx}
              style={{ animationDelay: `${(animationDelay + idx * animationInterval) / 1000}s` }}
            >
              <div className="mafia-class-time">{formatTime(cls.start)}</div>
              <div className="mafia-class-name">{cls.name}</div>
            </div>
          ) : null
        )}
      </div>

      {screenShots.map((hole) => (
        <span
          key={hole.id}
          className="bullet-hole-on-screen"
          style={{
            top: `${hole.top}%`,
            left: `${hole.left}%`,
            animationDelay: `${hole.delay / 1000}s`,
          }}
        />
      ))}
    </div>
  );
}
