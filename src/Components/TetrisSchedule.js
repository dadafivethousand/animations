import React, { useEffect, useState } from "react";
import "../Stylesheets/TetrisSchedule.css";
import schedule from "../Schedule";

export default function TetrisSchedule({ day, animationInterval = 400 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const entries = schedule[day] || [];

    entries.forEach((_, idx) => {
      const delay = (entries.length - 1 - idx) * animationInterval;
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, delay);
    });
  }, [day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const getTetrisLetter = (char, idx) => (
    <span key={idx} className={`tetris-letter letter-${idx}`}>{char}</span>
  );

  const entries = schedule[day] || [];

  return (
    <div className="tetris-wrapper">
      <h1 className="tetris-title">
        {[...day.toUpperCase()].map((char, idx) => getTetrisLetter(char, idx))}
      </h1>

      <div className="tetris-playfield">
        {entries.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div
              key={idx}
              className={`tetris-block block-${idx % 7}`}
              style={{
                animationDelay: `${(entries.length - 1 - idx) * animationInterval}ms`
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div className="tetris-square" key={i}>
                  {i === 1 && <span className="tetris-class">{cls.name}</span>}
                  {i === 2 && <span className="tetris-time">{formatTime(cls.start)}</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="tetris-placeholder" key={idx} />
          )
        )}
      </div>
    </div>
  );
}
