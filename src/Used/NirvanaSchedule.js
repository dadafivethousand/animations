import React, { useEffect, useState } from "react";
import "./NirvanaSchedule.css";
import schedule from "../RhSchedule";

export default function NirvanaSchedule({ day, delay = 1800 }) {
  const [visibleClasses, setVisibleClasses] = useState([]);
  const [displayDay, setDisplayDay] = useState("");

  // Typewriter for the day
  useEffect(() => {
    let startTimer = null;
    let typeInterval = null;

    startTimer = setTimeout(() => {
      let i = 0;
      typeInterval = setInterval(() => {
        setDisplayDay((day || "").substring(0, i + 1));
        i++;
        if (i > (day || "").length) clearInterval(typeInterval);
      }, 80);
    }, delay);

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [day, delay]);

  // Stagger-in classes
  useEffect(() => {
    const classes = schedule[day] || [];
    const timers = [];
    setVisibleClasses([]);

    const animationDelay = setTimeout(() => {
      classes.forEach((_, idx) => {
        const t = setTimeout(
          () => setVisibleClasses((prev) => [...prev, idx]),
          idx * 300
        );
        timers.push(t);
      });
    }, 1000 + delay);

    return () => {
      clearTimeout(animationDelay);
      timers.forEach(clearTimeout);
    };
  }, [day, delay]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="nirvana-container">
      <div className="nirvana-day">{displayDay}</div>

      <div className="nirvana-schedule">
        {(schedule[day] || []).map((cls, idx) =>
          visibleClasses.includes(idx) ? (
            <div className="nirvana-class" key={idx}>
              {/* Name + inline Maple chip kept on ONE line */}
              <div className="nirvana-row">
                <span className="nirvana-name">
                  {cls.replacement ? (
                    <span className="swap">
                      <span className="old">{cls.name}</span>
                      <span className="arrow" aria-hidden>→</span>
                      <span className="new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && (
                  <span className="chip chip--maple" title="Maple">📍 Maple</span>
                )}
              </div>

              {/* Start time ONLY */}
              <span className="nirvana-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
