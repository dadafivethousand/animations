import React, { useEffect, useState } from "react";
import "../Stylesheets/SpiderManSchedule.css";
import schedule from "../Schedule";

function SpiderManSchedule({ day }) {
  const [showClasses, setShowClasses] = useState(false);

  useEffect(() => {
    // Show classes after 1.5s
    const timeout = setTimeout(() => {
      setShowClasses(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="spiderman-container">
      {/* Subtle Animated Web Background */}
      <div className="spiderman-web"></div>

      {/* Day Title */}
      <h1 className="spiderman-title">{day}</h1>

      {/* Hanging Class Names */}
      <div className="spiderman-classes">
        {schedule[day] &&
          schedule[day].map((cls, idx) => (
            <div
              key={idx}
              className={`spiderman-class ${showClasses ? "drop-down" : ""}`}
              style={{
                animationDelay: `${idx * 0.3}s`,
                "--swing-angle": `${Math.random() * 6 - 3}deg`, // Random swing angle
                "--swing-speed": `${2 + Math.random() * 2}s`, // Random speed between 2s-4s
              }}
            >
              {/* Web Thread above text */}
              <div className="web-thread"></div>
              <span className="class-text">{cls.name} - {cls.start}:00</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SpiderManSchedule;
