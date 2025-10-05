import React, { useEffect, useState } from "react";
import "./StraightOuttaSchedule.css";
import schedule from "../RhSchedule";

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

  useEffect(() => {
    setWord("COMPTON");
    setDoneTyping(false);
    setVisible([]);

    const timeouts = [];
    const intervals = [];

    const startDelete = setTimeout(() => {
      const original = "COMPTON";
      let i = original.length;

      const del = setInterval(() => {
        i -= 1;
        setWord(original.slice(0, Math.max(i, 0)));
        if (i <= 0) {
          clearInterval(del);

          const target = "Richmond Hill";
          let j = 0;
          const type = setInterval(() => {
            j += 1;
            setWord(target.slice(0, j));
            if (j >= target.length) {
              clearInterval(type);
              setDoneTyping(true);
            }
          }, typeSpeed);
          intervals.push(type);
        }
      }, deleteSpeed);

      intervals.push(del);
    }, animationDelay);

    timeouts.push(startDelete);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      intervals.forEach((i) => clearInterval(i));
    };
  }, [day, animationDelay, deleteSpeed, typeSpeed]);

  useEffect(() => {
    if (!doneTyping) return undefined;

    const tids = [];
    const itemsForDay = schedule[day] || [];
    setVisible([]);

    itemsForDay.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisible((v) => (v.includes(i) ? v : [...v, i]));
      }, i * revealInterval);
      tids.push(t);
    });

    return () => tids.forEach((t) => clearTimeout(t));
  }, [doneTyping, day, revealInterval]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    const mm = m < 10 ? `0${m}` : m;
    return `${hr}:${mm} ${ap}`;
  };

  const items = schedule[day] || [];

  return (
    <div className="so-wrap">
      {/* Poster */}
      <div className="so-poster" role="img" aria-label={`Straight Outta ${word || " "}`}>
        <div className="so-frame">
          <div className="so-row so-top">STRAIGHT</div>
          <div className="so-row so-mid">OUTTA</div>
          <div className="so-row so-bot">
            <span className="so-type so-word">{word}</span>
          </div>
          <div className="so-grunge" aria-hidden="true" />
        </div>
      </div>

      <p className="so-day">{day}</p>

      {/* Horizontal rail of cards */}
      <div className="so-rail" role="list">
        {items.map((cls, i) =>
          visible.includes(i) ? (
            <div
              key={i}
              role="listitem"
              className="so-card so-in"
              style={{ animationDelay: `${i * 170}ms` }}
            >
              {/* FLEX INSIDE THE CLASS: name grows, MAPLE stays tight on the same line */}
              <div className="so-line">
                <span className="so-name">
                  {cls.replacement ? (
                    <span className="swap">
                      <span className="old">{cls.name}</span>
                      <span className="arrow" aria-hidden="true">→</span>
                      <span className="new">{String(cls.replacement)}</span>
                    </span>
                  ) : (
                    cls.name
                  )}
                </span>
                {cls.maple && <span className="so-badge">📍 MAPLE</span>}
              </div>

              {/* Start time ONLY (fixed width) */}
              <time className="so-time" aria-label="Class start time">
                {formatTime(cls.start)}
              </time>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
