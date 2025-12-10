import React, { useEffect, useState } from "react";
import "../Stylesheets/WhatsAppSchedule.css"; // keep this filename
import schedule from "../Schedule"; // or "../RhSchedule" if that's your source

export default function WhatsAppSchedule({
  day,
  animationDelay = 900,
  animationInterval = 160
}) {
  const [visible, setVisible] = useState([]);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

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
    if (typeof t !== "number") return "";
    const h = Math.floor(t);
    let m = Math.round((t - h) * 60);
    let hh = h;
    if (m === 60) { m = 0; hh = (h + 1) % 24; }
    const hr12 = (hh % 12) || 12;
    const ap = hh < 12 ? "AM" : "PM";
    return `${hr12}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  const initial = (s) =>
    typeof s === "string" && s.trim() ? s.trim().charAt(0).toUpperCase() : "•";

  const labelForReplacement = (rep) => {
    if (rep === true) return "Replacement";
    if (typeof rep === "string" && rep.trim()) return rep;
    return "";
  };

  return (
    <div className="wa2-wrap">
      {/* App bar */}
      <header className="wa2-appbar">
        <div className="wa2-brand">WhatsApp</div>
        <div className="wa2-actions" aria-hidden>
          <span className="wa2-ico wa2-ico-cam" />
          <span className="wa2-ico wa2-ico-search" />
          <span className="wa2-ico wa2-ico-menu" />
        </div>
      </header>

      {/* Tabs bar (CHATS active) + Day label to match your spec */}
      <div className="wa2-tabs">
        <button className="wa2-tab wa2-active">CHATS</button>
        <button className="wa2-tab">UPDATES</button>
        <button className="wa2-tab">CALLS</button>
        <h1 className="wa2-day">{safeDay.toUpperCase()}</h1>
      </div>

      {/* Chat list */}
      <main className="wa2-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article className="wa2-row wa2-in" key={i} style={{ animationDelay: `${i * 40}ms` }}>
              <div className="wa2-avatar" aria-hidden>{initial(cls.name)}</div>

              <div className="wa2-center">
                <div className="wa2-title">
                  {cls.replacement ? (
                    <span className="wa2-swap">
                      <span className="wa2-old">{cls.name}</span>
                      <span className="wa2-arrow" aria-hidden>→</span>
                      <span className="wa2-new">{labelForReplacement(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </div>

                {/* Maple badge sits like a snippet line */}
                {cls.maple && (
                  <div className="wa2-meta">
                    <span className="wa2-chip wa2-chip--maple">📍 Maple</span>
                  </div>
                )}
              </div>

              <time className="wa2-time">{formatTime(cls.start)}</time>
            </article>
          ) : null
        )}
      </main>

      {/* Floating new-chat action (decorative) */}
      <button className="wa2-fab" aria-label="New chat">
        <span className="wa2-fab-ico" />
      </button>
    </div>
  );
}
