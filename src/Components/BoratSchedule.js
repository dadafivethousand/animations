import React, { useEffect, useState } from "react";
import "../Stylesheets/BoratSchedule.css";
import schedule from "../RhSchedule";

export default function BoratSchedule({ day, animationDelay = 1000, animationInterval = 250 }) {
  const [visible, setVisible] = useState([]);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setVisible([]);
    setTitleVisible(false);

    const titleTimer = setTimeout(() => setTitleVisible(true), animationDelay);

    const classTimers = [];
    if (schedule[day]) {
      schedule[day].forEach((_, i) => {
        const timer = setTimeout(() => {
          setVisible((v) => [...v, i]);
        }, animationDelay + 700 + i * animationInterval); // extra time for wobble effect
        classTimers.push(timer);
      });
    }

    return () => {
      clearTimeout(titleTimer);
      classTimers.forEach(clearTimeout);
    };
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt),
      m = Math.round((dt - h) * 60),
      hr = h % 12 || 12,
      ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="borat-container">
      <h1
        className="borat-title"
        style={{ "--title-delay": `${animationDelay}ms` }}
      >
        {day.toUpperCase().split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>{char}</span>
        ))}
      </h1>

      <div className="borat-track">
        {titleVisible &&
          schedule[day]?.map((cls, i) =>
            visible.includes(i) && (
              <div key={i} className="borat-class" style={{ "--delay": `${i * 0.2}s` }}>
                <span className="borat-name">{cls.name}</span>
                <span className="borat-time">{formatTime(cls.start)}</span>
              </div>
            )
          )}
      </div>
      <img src={'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTF3OXpiMWRhdTQ0cTM2YjkwNjlyeW85ZmU2dGZweXczYmcxcmxoaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Od0QRnzwRBYmDU3eEO/giphy.gif'} />
    </div>
  );
}
