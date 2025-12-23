// YouTubeSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/YouTubeSchedule.css";
import schedule from "../Schedule";
import womensClass from "../Images/womensclass.JPG"
import kidsclass from "../Images/kids.jpeg"

export default function YouTubeSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160,
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);

    items.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, animationDelay + i * animationInterval);
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (t) => {
    if (typeof t !== "number") return "";
    let h = Math.floor(t);
    let m = Math.round((t - h) * 60);
    if (m === 60) {
      h += 1;
      m = 0;
    }
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    const mm = m < 10 ? "0" + m : String(m);
    return `${hr}:${mm} ${ap}`;
  };

  return (
    <div className="youtube-wrap">
      {/* Top YouTube bar */}
      <header className="youtube-appbar">
        <div className="youtube-logo">
          <span className="youtube-logo-icon" aria-hidden="true" />
          <span className="youtube-logo-text">YouTube</span>
        </div>

        <div className="youtube-searchbar">
          <input
            className="youtube-search-input"
            value="maple bjj saturday schedule"
            readOnly
          />
          <button className="youtube-search-btn" aria-label="Search">
            🔍
          </button>
        </div>

        <div className="youtube-avatar" aria-hidden="true" />
      </header>

      {/* Day label like a section title */}
      <div className="youtube-day-wrap">
        <h1 className="youtube-day">{safeDay.toUpperCase()}</h1>
      </div>

      <main className="youtube-list">
        {items.map((cls, i) => {
          if (!visible.includes(i)) return null;

          const hasReplacement = !!cls.replacement;
          const newName =
            typeof cls.replacement === "string"
              ? cls.replacement
              : "Replacement";

          return (
            <article className="youtube-card youtube-in" key={i}>
              {/* Thumbnail column */}
              <div className="youtube-thumb-wrap">
             
                  {cls.thumbnailUrl && (
                    <img
                      src={cls.thumbnailUrl}
                      alt={cls.name}
                      className="youtube-thumb-img"
                    />
                  )  }
              
                <div className="youtube-thumb-placeholder">
                  <span className="youtube-thumb-label">Thumbnail</span>
                </div>

                {/* Time overlay like video duration */}
                <time className="youtube-time-overlay">
                 1:00:00
                </time>
              </div>

              {/* Meta column */}
              <div className="youtube-meta">
                <div className="youtube-title-row">
                  <div className="youtube-title">
                    {hasReplacement ? (
                      <span className="youtube-swap">
                        <span className="youtube-old">{cls.name}</span>
                        <span className="youtube-arrow" aria-hidden="true">
                          →
                        </span>
                        <span className="youtube-new">{newName}</span>
                      </span>
                    ) : (
                      cls.name
                    )}
                  </div>

                  {cls.maple && (
                    <span className="youtube-chip youtube-chip--maple">
                      📍 MAPLE
                    </span>
                  )}
                </div>

                <div className="youtube-subline">
                  Class start • {formatTime(cls.start)}
                </div>
                <div className="youtube-desc">
                  Saturday training block for Maple BJJ. Tap for details on
                  level, focus, and coach notes.
                </div>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
