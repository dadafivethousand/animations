import React, { useEffect, useState } from "react";
import "../Stylesheets/DonkeyKongSchedule.css";
import schedule from "../Schedule";

export default function DonkeyKongSchedule({ day, animationDelay = 1500, secondAnimationDelay = 2500, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [dayText, setDayText] = useState("");
  const [phase, setPhase] = useState("waiting");
  const [phaseTwo, setPhaseTwo] = useState("waiting");

  useEffect(() => {
    const entries = schedule[day] || [];

    // Phase 1: Delay before animations
    const waitTimeout = setTimeout(() => {
      setPhase("typingDay");
    }, animationDelay);

     const wTimeout = setTimeout(() => {
      setPhaseTwo("showClasses");
    }, secondAnimationDelay);


    // Animate class cards
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray((prev) => [...prev, idx]);
      }, secondAnimationDelay + idx * animationInterval);
    });

    return () => clearTimeout(wTimeout, waitTimeout);
  }, [day, animationDelay, animationInterval]);

  useEffect(() => {
    if (phase === "typingDay") {
      const text = day.toUpperCase();
      let i = 0;

      const interval = setInterval(() => {
        setDayText(text.substring(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(interval);
        }
      }, 120);

      return () => clearInterval(interval);
    }
  }, [phase, day]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="dk-wrapper">
      <h1 className="dk-title">{dayText}</h1>
      <div className="dk-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="dk-card" key={idx}>
              <span className="dk-class">{cls.name}</span>
              <span className="dk-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
