import React, { useEffect, useState } from "react";
import "./UndertakerSchedule.css";
import schedule from "../RhSchedule";

export default function UndertakerSchedule({
  day,
  animationDelay = 1800,
  animationInterval = 150
}) {
  const [visibleArray, setVisibleArray] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisibleArray([]);

    items.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (decimalTime) => {
    if (typeof decimalTime !== "number") return "";
    const hour = Math.floor(decimalTime);
    let minutes = Math.round((decimalTime - hour) * 60);
    let h = hour;
    if (minutes === 60) { minutes = 0; h = (hour + 1) % 24; }
    const hr12 = h % 12 || 12;
    const ampm = h < 12 ? "AM" : "PM";
    const mm = minutes < 10 ? `0${minutes}` : minutes;
    return `${hr12}:${mm} ${ampm}`;
  };

  return (
    <div className="undertaker-container">
      <div className="undertaker-day-track">
        <h1 className="undertaker-day">{safeDay.toUpperCase()}</h1>

        <div className="undertaker-track">
          {items.map((cls, idx) => (
            <div key={idx} className="undertaker-class-container">
              {visibleArray.includes(idx) && (
                <article className="undertaker-class">
                  <div className="undertaker-left">
                    <div className="undertaker-class-name">{cls.name}</div>

                    {/* Maple indicator (inside the card) */}
                    {cls.maple && (
                      <div className="undertaker-tags">
                        <span className="undertaker-chip undertaker-chip--maple">
                          📍 Maple
                        </span>
                      </div>
                    )}
                  </div>

                  <time className="undertaker-class-time">
                    {formatTime(cls.start)}
                  </time>
                </article>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
