// JimmyNeutronSchedule.jsx
import React, { useEffect, useState } from "react";
import "../Stylesheets/JimmyNeutronSchedule.css";
import schedule from "../Schedule";

const REACT_ATOM_SRC = "/favicon.ico"; // React favicon as atom icon

export default function JimmyNeutronSchedule({
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
      const t = setTimeout(
        () =>
          setVisible((prev) => {
            if (!prev.includes(i)) return [...prev, i];
            return prev;
          }),
        animationDelay + i * animationInterval
      );
      timers.push(t);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [safeDay, items.length, animationDelay, animationInterval]);

  const formatTime = (decimalHour) => {
    const h = Math.floor(decimalHour);
    const minutesRaw = (decimalHour - h) * 60;
    let m = Math.round(minutesRaw);
    let hh = h;
    if (m === 60) {
      hh = hh + 1;
      m = 0;
    }
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const ap = hh < 12 ? "AM" : "PM";
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${hour12}:${mm} ${ap}`;
  };

  return (
    <div className="neutron-wrap">
      <header className="neutron-header" role="banner">
        <div className="neutron-header-orbit" aria-hidden="true">
          <span className="neutron-header-atom" />
        </div>
        <h1 className="neutron-day">
          {safeDay ? safeDay.toUpperCase() : ""}
        </h1>
      </header>

      <main
        className="neutron-list"
        aria-live="polite"
        aria-label={`${safeDay || "Selected day"} schedule`}
      >
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className={`neutron-card ${
                cls.replacement ? "neutron-has-replacement" : ""
              } neutron-in`}
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              aria-labelledby={`neutron-title-${i}`}
            >
              <div className="neutron-left">
                <div className="neutron-atom" aria-hidden="true">
                  <img
                    src={REACT_ATOM_SRC}
                    alt=""
                    className="neutron-atom-icon"
                    loading="lazy"
                  />
                </div>

                <div
                  className="neutron-title"
                  id={`neutron-title-${i}`}
                  title={cls.name}
                >
                  {cls.replacement ? (
                    <span className="neutron-swap">
                      <span className="neutron-old">{cls.name}</span>
                      <span className="neutron-arrow" aria-hidden>
                        →
                      </span>
                      <span className="neutron-new">
                        {typeof cls.replacement === "string"
                          ? cls.replacement
                          : "Replacement"}
                      </span>
                    </span>
                  ) : (
                    <span className="neutron-normal">{cls.name}</span>
                  )}
                </div>

                {cls.maple && (
                  <span className="neutron-chip neutron-chip--maple">
                    📍 MAPLE
                  </span>
                )}
              </div>

              <time className="neutron-time" dateTime={String(cls.start)}>
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
    </div>
  );
}
