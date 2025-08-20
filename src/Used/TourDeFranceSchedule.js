import React, { useEffect, useState } from "react";
import "../Stylesheets/TourDeFranceSchedule.css";
import schedule from "../Schedule";

export default function TourDeFranceSchedule({
  day,
  animationDelay = 900,
  animationInterval = 220,
  title = "Tour de France – Stage Schedule",
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const timers = [];
    const items = schedule[day] || [];
    items.forEach((_, i) => {
      const t = setTimeout(() => setVisible((v) => [...v, i]), animationDelay + i * animationInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const h = Math.floor(decimalTime);
    const m = Math.round((decimalTime - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="tdf-wrap">
      {/* Road background & jersey header */}
      <header className="tdf-header">
        <div className="tdf-jersey">
          <span className="tdf-day">{(day || "").toUpperCase()}</span>
        </div>
      </header>

      <div className="tdf-stage-list">
        {(schedule[day] || []).map((cls, i) => (
          <div key={i} className="tdf-stage-wrap">
            {visible.includes(i) && (
              <>
                <article className="tdf-stage-card">
                  <div className="tdf-left">
                    {/* bib number style dot */}
                 
                    <span className="tdf-name">{cls.name}</span>
                  </div>
                  <span className="tdf-time">{formatTime(cls.start)}</span>

                  {/* corner chevrons */}
                  <i className="tdf-corner tl" aria-hidden />
                  <i className="tdf-corner tr" aria-hidden />
                  <i className="tdf-corner bl" aria-hidden />
                  <i className="tdf-corner br" aria-hidden />
                </article>

                {cls.maple && <div className="tdf-maple">📍 Maple Location</div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
