import React, { useEffect, useState } from "react";
import "./SamuraiSchedule.css";
import schedule from "../../RhSchedule"; // Assuming schedule data exists
import Katana from "./Katana";

function SamuraiSchedule({
  day,
  animationDelay = 2500,
  animationInterval = 500,
}) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [visibleImage, setVisibleImage] = useState(false);
  const [moveKatanas, setMoveKatanas] = useState(false);
  const [moveKatana, setMoveKatana] = useState(false);

  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  // Show background image
  useEffect(() => {
    const t = setTimeout(() => {
      setVisibleImage(true);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  // Move katanas (pair)
  useEffect(() => {
    const t = setTimeout(() => {
      setMoveKatanas(true);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  // Move single katana
  useEffect(() => {
    const t = setTimeout(() => {
      setMoveKatana(true);
    }, 5500);
    return () => clearTimeout(t);
  }, []);

  // Reveal schedule entries
  useEffect(() => {
    setVisibleArray([]);
    const classes = items;
    if (!classes.length) return;

    const timeouts = [];
    const startTimeout = setTimeout(() => {
      classes.forEach((_, idx) => {
        const t = setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
        timeouts.push(t);
      });
    }, animationDelay);

    return () => {
      clearTimeout(startTimeout);
      timeouts.forEach(clearTimeout);
    };
  }, [safeDay, animationDelay, animationInterval, items.length]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="samurai-scroll">
      {/* Samurai Battle Banner (Day of the Week) */}
      <div className="samurai-banner">
        <div className="samurai-banner-text">{safeDay.toUpperCase()}</div>
      </div>

      <div className="samurai-paper">
        <div className="samurai-classes">
          {items.map((cls, idx) => (
            <div key={idx} className="samurai-entry-container">
              {visibleArray.includes(idx) && (
                <div className="samurai-entry samurai-slice">
                  <div className="samurai-kanji">武</div>
                  <div className="samurai-text">
                    <div className="samurai-line">
                      <span className="samurai-class-name">{cls.name}</span>
                      {cls.maple && (
                        <span className="samurai-chip">📍 MAPLE</span>
                      )}
                    </div>
                    <span className="samurai-class-time">
                      {formatTime(cls.start)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="samurai-katanas">
          <div className={`katana-one ${moveKatanas ? "katana-left" : ""}`}>
            <Katana />
          </div>

          <div className={`katana-two ${moveKatana ? "katana-right" : ""}`}>
            <Katana />
          </div>
        </div>
      </div>

      <div
        className={`samurai-image ${visibleImage ? "samurai-show" : ""}`}
      ></div>
    </div>
  );
}

export default SamuraiSchedule;
