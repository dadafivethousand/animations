// AppleSchedule.jsx — mobile-first iOS-style schedule (improved), uses ../Stylesheets/iosSchedule.css
import React, { useEffect, useState } from "react";
import "../Stylesheets/IosSchedule.css";
import schedule from "../Schedule";

export default function AppleSchedule({
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
    <div className="ios-wrap">
      {/* Large Title + subtle nav */}
      <header className="ios-header">
        <div className="ios-nav">
          <button className="ios-nav-btn" aria-label="Back">‹</button>
          <span className="ios-nav-spacer" />
          <button className="ios-nav-btn" aria-label="More">•••</button>
        </div>
        <h1 className="ios-large-title">{(day || "").toUpperCase()}</h1>
      </header>

      {/* Content */}
      <main className="ios-main">
        {/* Grouped list like iOS Settings/Calendar */}
        <section className="ios-group">
          {(schedule[day] || []).map((cls, i) =>
            visible.includes(i) ? (
              <article
                key={i}
                className="ios-cell ios-in"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <div className="ios-leading">
                  <div className="ios-dot" aria-hidden />
                </div>

                <div className="ios-body">
                  <div className="ios-title-row">
                    <div className="ios-name">
                      {cls.replacement ? (
                        <span className="ios-swap">
                          <span className="ios-old">{cls.name}</span>
                          <span className="ios-arrow" aria-hidden>→</span>
                          <span className="ios-new">{String(cls.replacement)}</span>
                        </span>
                      ) : (
                        cls.name
                      )}
                    </div>
                    {cls.maple && (
                      <span className="ios-badge">
                        <span className="ios-pin" aria-hidden>📍</span>
                        Maple
                      </span>
                    )}
                  </div>

                  <div className="ios-subrow">
                    <time className="ios-time">
                      <span className="ios-clock" aria-hidden>🕑</span>
                      {formatTime(cls.start)}
                    </time>
                  </div>
                </div>

                <div className="ios-trailing" aria-hidden>›</div>
              </article>
            ) : null
          )}
        </section>
      </main>
    </div>
  );
}
