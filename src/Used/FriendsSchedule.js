// FriendsSchedule.jsx — black background, smaller weekday, configurable animationDelay
import React, { useEffect, useState } from "react";
import "../Stylesheets/FriendsSchedule.css";
import schedule from "../RhSchedule";

export default function FriendsSchedule({
  day,
  animationDelay = 900,
  animationInterval = 180,
}) {
  const [visibleIdx, setVisibleIdx] = useState([]);
  const [dayVisible, setDayVisible] = useState(false);

  useEffect(() => {
    setDayVisible(false);
    const t = setTimeout(() => setDayVisible(true), animationDelay);
    return () => clearTimeout(t);
  }, [day, animationDelay]);

  useEffect(() => {
    const classes = schedule[day] || [];
    setVisibleIdx([]);
    const timers = [];
    classes.forEach((_, i) => {
      const t = setTimeout(
        () => setVisibleIdx((v) => [...v, i]),
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

  const renderDayWithDots = (word) => {
    const colors = ["fr-dot--red", "fr-dot--blue", "fr-dot--yellow"];
    const letters = (word || "").toUpperCase().split("");
    const out = [];
    letters.forEach((ch, i) => {
      out.push(
        <span key={`l-${i}`} className="fr-day-letter">
          {ch}
        </span>
      );
      if (i < letters.length - 1) {
        out.push(
          <span
            key={`d-${i}`}
            className={`fr-dot ${colors[i % colors.length]}`}
            aria-hidden
          >
            •
          </span>
        );
      }
    });
    return out;
  };

  return (
    <div className="fr-wrap">
      <h1 className={`fr-day ${dayVisible ? "fr-title-in" : ""}`} aria-label={day}>
        {renderDayWithDots(day)}
      </h1>

      <div className="fr-list">
        {(schedule[day] || []).map((cls, i) =>
          visibleIdx.includes(i) ? (
            <div className="fr-card fr-in" key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="fr-left">
                <span className="fr-bullet" aria-hidden />
                <span className="fr-name">
                  {cls.replacement ? (
                    <span className="fr-swap">
                      <span className="fr-old">{cls.name}</span>
                      <span className="fr-arrow" aria-hidden>→</span>
                      <span className="fr-new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="fr-chip">📍 MAPLE</span>}
              </div>
              <time className="fr-time">{formatTime(cls.start)}</time>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
