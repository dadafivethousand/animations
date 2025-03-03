import React, { useEffect, useState } from "react";
import "../Stylesheets/BoxingSchedule.css";
import schedule from "../Schedule";

function BoxingSchedule({ day }) {
  const [punchedClasses, setPunchedClasses] = useState([]);
  const [currentPunch, setCurrentPunch] = useState(-1); // Tracks which class is being punched
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };
  useEffect(() => {
    if (schedule[day]?.length) {
      schedule[day].forEach((_, idx) => {
        setTimeout(() => {
          setCurrentPunch(idx); // Move glove to this class
          setTimeout(() => {
            setPunchedClasses((prev) => [...prev, idx]); // Reveal class
            setTimeout(() => {
              setCurrentPunch(-1); // Make glove disappear before next move
            }, 500); // Delay before glove moves to next target
          }, 500); // Delay for impact effect
        }, idx * 1500); // Adjust delay per punch
      });
    }
  }, [day]);

  return (
    <div className="boxing-container">
      <div className="boxing-content">
        <h2 className="boxing-title">{day}</h2>

        {/* Boxing Glove Punching in Sequence */}
        {currentPunch !== -1 && (
          <div
            className="boxing-glove"
            style={{
              top: `${currentPunch * 100 + 150}px`,
              animation: "punchIn 0.6s ease-in-out forwards, punchOut 0.6s ease-in-out 0.8s forwards"
            }}
          >
            🥊
          </div>
        )}

        {/* Schedule Classes (Always Visible) */}
        <div className="boxing-classes">
          {schedule[day]?.map((cls, idx) => (
            <div key={idx} className={`boxing-class ${punchedClasses.includes(idx) ? "punched" : ""}`}>
              <div className="boxing-class-name">{cls.name}</div>
              <div className={`boxing-class-time ${punchedClasses.includes(idx) ? "visible" : ""}`}>
                {formatTime(cls.start)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BoxingSchedule;
