// AmazonSchedule.jsx — mobile-first (fits small screens), Maple + replacement supported
import React, { useEffect, useState } from "react";
import "../Stylesheets/AmazonSchedule.css";
import schedule from "../Schedule";


export default function AmazonSchedule({
  day,
  animationDelay = 700,
  animationInterval = 180,
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

  const stars = (n = 4) => "★★★★★" ;

  return (
    <div className="amzM-wrap">
      <header className="amzM-header">
        <div className="amzM-brand">amazon</div>
        <div className="amzM-search">
          <span className="amzM-all">All ▾</span>
          <input
            className="amzM-input"
            placeholder={`Search ${day} classes…`}
            readOnly
          />
          <button className="amzM-go">🔍</button>
        </div>
      </header>

      <main className="amzM-main">
        <div className="amzM-title">
          Results for <strong>{day}</strong> schedule
        </div>

        <div className="amzM-list">
          {(schedule[day] || []).map((cls, i) =>
            visible.includes(i) ? (
              <article
                key={i}
                className="amzM-item amzM-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="amzM-row">
                   <img className="amzM-picture" src={cls.pic} />
                  <div className="amzM-info">
                    <h2 className="amzM-name">
                      {cls.replacement ? (
                        <span className="amzM-nameSwap">
                          <span className="amzM-old">{cls.name}</span>
                          <span className="amzM-arrow" aria-hidden>
                            →
                          </span>
                          <span className="amzM-new">
                            {String(cls.replacement)}
                          </span>
                        </span>
                      ) : (
                        cls.name
                      )}
                      {cls.maple && (
                        <span className="amzM-prime">
                          <span className="amzM-pin" aria-hidden>
                            📍
                          </span>
                          MAPLE
                        </span>
                      )}
                    </h2>

                    <div className="amzM-meta">
                      <span className="amzM-stars" aria-hidden>
                        {stars(4 - (i % 2))}
                      </span>
                      <span className="amzM-rev">
                        {(240 + i * 5).toLocaleString()} ratings
                      </span>
                    </div>

                    <div className="amzM-sub">
                      <span className="amzM-free">Free Trial</span>
                      <span className="amzM-dot">•</span>
                      <span className="amzM-time">{formatTime(cls.start)}</span>
                    </div>
                  </div>
                </div>

                <div className="amzM-actions">
                  <button className="amzM-cta">Add</button>
                  <button className="amzM-sec">Details</button>
                </div>
              </article>
            ) : null
          )}
        </div>
      </main>
    </div>
  );
}
