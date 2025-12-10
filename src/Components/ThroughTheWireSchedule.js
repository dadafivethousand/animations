// ThroughTheWireSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/ThroughTheWireSchedule.css";
import schedule from "../Schedule";
import ThroughTheWireCover from "../Images/throughthewire.jpg"


export default function ThroughTheWireSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];
  
 const coverDelayMs = animationDelay + items.length * animationInterval + 120; // tweak as needed


  useEffect(() => {
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
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="throughthewire-wrap">
      <header className="throughthewire-header">
        {/* album-cover supplied by user; white page background requested */}
   
        <h1 className="throughthewire-day" aria-hidden>
          {safeDay.toUpperCase()}
        </h1>
      </header>

      <main className="throughthewire-list" aria-live="polite">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              key={i}
              className={`throughthewire-card throughthewire-in ${
                cls.cancelled ? "is-cancelled" : ""
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-label={`${cls.name}${cls.cancelled ? " — cancelled" : ""}`}
            >
              <div className="throughthewire-left">
                <div className="throughthewire-title">
                  {cls.replacement ? (
                    <span className="throughthewire-swap">
                      <span className="throughthewire-old">{cls.name}</span>
                      <span className="throughthewire-arrow" aria-hidden>
                        →
                      </span>
                      <span className="throughthewire-new">
                        {typeof cls.replacement === "string"
                          ? cls.replacement
                          : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {cls.maple && (
                  <span
                    className="throughthewire-chip throughthewire-chip--maple"
                    title="Maple"
                  >
                    📍 MAPLE
                  </span>
                )}

                {cls.cancelled && (
                  <span
                    className="throughthewire-chip throughthewire-chip--cancelled"
                    role="status"
                    aria-label="Cancelled"
                  >
                    ✖ Cancelled
                  </span>
                )}
              </div>

              <time className="throughthewire-time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
       <img
  src={ThroughTheWireCover}
  alt="Through The Wire cover"
  className="throughthewire-cover"
  style={{ animationDelay: `${coverDelayMs}ms` }}
/>
    </div>
  );
}
