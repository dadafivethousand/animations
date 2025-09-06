// ESPNSchedule.jsx — mobile-first ESPN styling with MAPLE + replacement support
import React, { useEffect, useState } from "react";
import "./EspnSchedule.css";
import schedule from "../RhSchedule";

export default function EspnSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const [titleOn, setTitleOn] = useState(false);

  useEffect(() => {
    setTitleOn(false);
    const t = setTimeout(() => setTitleOn(true), animationDelay);
    return () => clearTimeout(t);
  }, [day, animationDelay]);

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
    <div className="espn-wrap">

         <h1 className="espn-day">{(day || "").toUpperCase()}</h1>


      <main className="espn-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div
              className="espn-card espn-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="espn-left">
                <span className="espn-stripe" aria-hidden />
                <span className="espn-name">
                  {cls.replacement ? (
                    <span className="espn-swap">
                      <span className="espn-old">{cls.name}</span>
                      <span className="espn-arrow" aria-hidden>→</span>
                      <span className="espn-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="espn-chip">📍 MAPLE</span>}
              </div>
              <time className="espn-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </main>

      <div className="espn-ticker" aria-hidden>
        <div className="espn-tape">
          TRAIN HARD • LEARN FROM THE BEST • GET RESULTS • NO EXCUSES • #1 IN RICHMOND HILL 
        </div>
      </div>
    </div>
  );
}
