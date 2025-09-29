import React, { useEffect, useState } from "react";
import "../Stylesheets/DontApproachSchedule.css";
import schedule from "../Schedule"; // or "../RhSchedule" if you prefer
import dontApproach from "../Images/Xzibit_Feat_Eminem_Don_t_Approach_Me.mp4"

export default function DontApproachSchedule({ day, animationDelay = 900, animationInterval = 160 }) {
  const [visible, setVisible] = useState([]);
    const [visibleVideo, setVisibleVideo] = useState(false);
  const safeDay = day || "";
  const items = schedule[safeDay] || [];

useEffect(() => {
  const timer = setTimeout(() => {
    setVisibleVideo(true);
  }, 3000);

  // cleanup (in case the component unmounts before timeout finishes)
  return () => clearTimeout(timer);
}, []);

 


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
    <div className="dam-wrap">
      <header className="dam-header">
        <h1 className="dam-day">{safeDay.toUpperCase()}</h1>
      </header>

      <main className="dam-list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <article
              className="dam-card dam-in"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="dam-left">
                <div className="dam-title-row">
                  <span className="dam-title">
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
              </div>

              {/* Start time ONLY */}
              <time className="dam-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </article>
          ) : null
        )}
      </main>
      <video src= {dontApproach}
      autoPlay
        loop
        muted
        playsInline
        className={`dam-video-bg ${visibleVideo && "dam-video-visible"}`}/>
    </div>
  );
}
