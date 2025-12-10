// LegoSchedule.jsx — same component, title styled like LEGO logo
import React, { useEffect, useState } from "react";
import "../Stylesheets/LegoSchedule.css";
import schedule from "../Schedule";
import LegoText from "./LegoText";

export default function LegoSchedule({
  day,
  animationDelay = 600,
  animationInterval = 140,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const items = schedule[day] || [];
    const timers = [];
    setVisible([]);
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
    <div className="lego2-wrap">
      <header className="lego2-head">
        <div className="lego2-logo">
          <LegoText word={day} />
         </div>
      </header>

      <main className="lego2-panel">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div className="lego2-row lego2-in" key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="lego2-left">
                <span className="lego2-name">
                  {cls.replacement ? (
                    <span className="lego2-swap">
                      <span className="lego2-old">{cls.name}</span>
                      <span className="lego2-arrow" aria-hidden>→</span>
                      <span className="lego2-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="lego2-sticker" title="Maple location">MAPLE</span>}
              </div>
              <time className="lego2-bubble">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </main>
    </div>
  );
}
