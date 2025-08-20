// StraightOuttaSchedule.js
import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/StraightOuttaSchedule.css";
import schedule from "../Schedule";

export default function StraightOuttaSchedule({
  day,
  animationDelay = 2200,
  deleteSpeed = 120,
  typeSpeed = 120,
  revealInterval = 160,
}) {
  const [word, setWord] = useState("COMPTON");
  const [doneTyping, setDoneTyping] = useState(false);
  const [visible, setVisible] = useState([]);
  const caretRef = useRef(null);

  useEffect(() => {
    setWord("COMPTON");
    setDoneTyping(false);
    setVisible([]);

    let timers = [];
    // 1) wait -> delete "COMPTON"
    const startDelete = setTimeout(() => {
      const original = "COMPTON";
      let i = original.length;
      const del = setInterval(() => {
        i--;
        setWord(original.slice(0, i));
        if (i <= 0) {
          clearInterval(del);
          // 2) type "MAPLE"
          const target = "MAPLE";
          let j = 0;
          const type = setInterval(() => {
            j++;
            setWord(target.slice(0, j));
            if (j >= target.length) {
              clearInterval(type);
              setDoneTyping(true);
            }
          }, typeSpeed);
          timers.push(type);
        }
      }, deleteSpeed);
      timers.push(del);
    }, animationDelay);
    timers.push(startDelete);

    return () => timers.forEach(clearTimeout);
  }, [day, animationDelay, deleteSpeed, typeSpeed]);

  useEffect(() => {
    if (!doneTyping) return;
    const items = schedule[day] || [];
    const tids = [];
    items.forEach((_, i) => {
      const t = setTimeout(() => setVisible((v) => [...v, i]), i * revealInterval);
      tids.push(t);
    });
    return () => tids.forEach(clearTimeout);
  }, [doneTyping, day, revealInterval]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="so-wrap">
      {/* Poster */}
      <div className="so-poster" role="img" aria-label={`Straight Outta ${word || " "}`}>
        <div className="so-frame">
          <div className="so-row so-top">STRAIGHT</div>
          <div className="so-row so-mid">OUTTA</div>
          <div className="so-row so-bot">
            <span className="so-type">{word}</span>
 
          </div>
          <div className="so-grunge" aria-hidden />
        </div>
      </div>
    <p className="so-day">{day}</p>
      {/* Schedule */}
      <div className="so-list">
        {(schedule[day] || []).map((cls, i) =>
          visible.includes(i) ? (
            <div key={i} className="so-card" style={{ animationDelay: `${i * 170}ms` }}>
              <div className="so-left">
                <span className="so-name">{cls.name}</span>
                {cls.maple && <span className="so-badge">MAPLE</span>}
              </div>
              <span className="so-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
