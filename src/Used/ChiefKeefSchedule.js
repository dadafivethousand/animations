// ChiefKeefSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/ChiefKeefSchedule.css";
import schedule from "../Schedule";
import TypewriterCycle from "../Utils/TypewriterCycle";

export default function ChiefKeefSchedule({
  day,
  animationDelay = 1000,
  animationInterval = 200,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const items = schedule[day] || [];
    setVisible([]);
    const timers = [];
    items.forEach((_, i) => {
      const t = setTimeout(
        () => setVisible((v) => [...v, i]),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="ck-wrap">

        <div className="ck-day">
   <TypewriterCycle pauseTime={20000} texts={[day]} /> 
     </div>
      
      <div className="ck-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="ck-card ck-in" key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="ck-left">
                <span className="ck-bolt" aria-hidden />
                <span className="ck-name">
                  {cls.replacement ? (
                    <span className="ck-swap">
                      <span className="ck-old">{cls.name}</span>
                      <span className="ck-arrow" aria-hidden>→</span>
                      <span className="ck-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="ck-chip">📍 MAPLE</span>}
              </div>
              <time className="ck-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
