import React, { useEffect, useState } from "react";
import "../Stylesheets/HitEmUpSchedule.css";
import schedule from "../Schedule";

export default function HitEmUpSchedule({ day, animationDelay = 300, animationInterval = 200 }) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    schedule[day]?.forEach((_, i) => {
      setTimeout(() => setVisible(v => [...v, i]), animationDelay + i * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = dt => {
    const h = Math.floor(dt), m = Math.round((dt - h) * 60);
    const hr = h % 12 || 12, ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0"+m : m} ${ap}`;
  };

  return (
    <div className="he-container">
              <img src={'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOW0yZzBjMnhsbGxxM2lkcDJpeHpwbHA2NWxxYWVhdzl4MzJ2dXhkdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9nSWOyPuQfUCA/giphy.gif'}/>

      <h1 className="he-header">{day.toUpperCase()}</h1>
      <div className="he-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="he-class">
              <span className="he-class-name">{cls.name}</span>
              <span className="he-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
