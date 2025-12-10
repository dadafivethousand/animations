import React, { useEffect, useState } from "react";
import "./DJKhaledSchedule.css";
import schedule from "../RhSchedule";

export default function DJKhaledSchedule({
  day,
  animationDelay = 1700,
  animationInterval = 200,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    schedule[day]?.forEach((_, i) => {
      setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt),
      m = Math.round((dt - h) * 60),
      hr = h % 12 || 12,
      ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="dk-container">
      <h1 className="dk-header">{day.toUpperCase()}</h1>
      <div className="dk-track">
        {schedule[day]?.map((cls, i) =>
          visible.includes(i) && (
            <div key={i} className="dk-class">
              <div className="dk-class-info">
                <span className="dk-class-name">{cls.name}</span>
                {cls.maple && <span className="dk-maple-tag">(at Maple BJJ)</span>}
              </div>
              <span className="dk-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        )}
      </div>
      <img
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTZoYm8zMjB5dzh0ZTNhM3poYW1hemZwOXgwMzhtNjNwOHVkMTExeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3zoTAbMu27n6zrH2/giphy.gif"
        alt="DJ Khaled"
      />
    </div>
  );
}
