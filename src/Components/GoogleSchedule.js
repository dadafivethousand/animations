import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/GoogleSchedule.css";
import schedule from "../Schedule";

export default function GoogleSchedule({
  day,
  animationDelay = 2200,   // ⬅️ wait before typing starts
  typeSpeed = 40,          // ms per character
  resultsDelay = 250,      // ⬅️ wait after typing before results reveal
  revealInterval = 90,     // ms stagger per row
}) {
  const [typed, setTyped] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);
  const inputRef = useRef(null);

  const query = `${day} Schedule`;

  useEffect(() => {
    setTyped("");
    setDoneTyping(false);
    setVisibleRows([]);

    let i = 0;
    let iv;
    const startTyping = () => {
      iv = setInterval(() => {
        i++;
        setTyped(query.slice(0, i));
        if (i >= query.length) {
          clearInterval(iv);
          setDoneTyping(true);
        }
      }, typeSpeed);
    };

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 10);
    const startTimer = setTimeout(startTyping, animationDelay);

    return () => {
      clearInterval(iv);
      clearTimeout(startTimer);
      clearTimeout(focusTimer);
    };
  }, [query, typeSpeed, animationDelay]);

  useEffect(() => {
    if (!doneTyping) return;
    setVisibleRows([]);
    const rows = schedule[day] || [];
    const timers = [];
    rows.forEach((_, idx) => {
      const t = setTimeout(() => {
        setVisibleRows((prev) => [...prev, idx]);
      }, resultsDelay + idx * revealInterval);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [doneTyping, day, resultsDelay, revealInterval]);

  const formatTime = (t) => {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    const hr = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr}:${m < 10 ? "0" + m : m} ${ap}`;
  };

  return (
    <div className="g-wrap">
      <header className="g-top">
        <div className="g-logo" aria-label="Google">
          <span className="g g-b">G</span>
          <span className="g g-r">o</span>
          <span className="g g-y">o</span>
          <span className="g g-b2">g</span>
          <span className="g g-g">l</span>
          <span className="g g-r2">e</span>
        </div>
<div>

    <div className="searchbar-container">
        <div className="g-searchbar">
          <div className="g-icon g-mag" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#9aa0a6" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16a6.471 6.471 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/></svg>
          </div>
          <input
            ref={inputRef}
            className="g-input"
            value={typed}
            readOnly
            spellCheck={false}
            aria-label="Search"
          />
     
          <div className="g-actions">
            <button className="g-icon g-mic" aria-label="Search by voice">
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285f4" d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"/><path fill="#34a853" d="M11 19.93V22h2v-2.07a7.002 7.002 0 0 0 6-6.86h-2a5 5 0 0 1-10 0H5a7.002 7.002 0 0 0 6 6.86Z"/></svg>
            </button>
     
          </div>
        </div>
        </div>
 <br></br>
        <nav className="g-tabs" aria-label="Search options">
 
          <button className="active"><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>All</button>
          <button><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5H3v14h18ZM5 7h14v10H5Z"/></svg>Images</button>
          <button><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v12H3z"/></svg>News</button>
          <button><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v14H3z"/></svg>More</button>
        </nav>
        </div>
      </header>

      {doneTyping && (
        <main className="g-results" role="main">
          <div className="g-stats">
            About {String((schedule[day] || []).length).padStart(2, "0")} results ({(Math.random()*0.2 + 0.19).toFixed(2)} seconds)
          </div>

          <article className="g-result">
            <a className="g-link" href="#" onClick={(e)=>e.preventDefault()}>
              Schedule — {day}
            </a>
            <div className="g-url">
              maplebjj.com<span className="g-url-chev"> › </span>schedule
            </div>
            <div className="g-snippet">
              {day} schedule. Pull up.
            </div>

            <div className="g-knowledge">
              {(schedule[day] || []).map((cls, idx) =>
               
                  <div className="g-row" key={idx} style={{ animationDelay: `${resultsDelay + idx * revealInterval}ms` }}>
                    <div className="g-time">{formatTime(cls.start)}</div>
                    <div className="g-class">
                      {cls.replacement ? (
                        <span className="g-name-block">
                          <span className="g-old">{cls.name}</span>
                          <span className="g-new">→ {String(cls.replacement)}</span>
                        </span>
                      ) : (
                        <span className="g-name">{cls.name}</span>
                      )}
                      {cls.maple && <span className="g-badge">Maple</span>}
                    </div>
                  </div>
             
              )}
            </div>
          </article>

          <footer className="g-footer">
            <div className="g-gbar">
              <span className="g-letter gB">G</span>
              {"o".repeat(2).split("").map((_, i) => (
                <span key={i} className={`g-letter ${i === 0 ? "gO" : "go"}`}>o</span>
              ))}
              <span className="g-letter gl">g</span>
              <span className="g-letter ge">l</span>
              <span className="g-letter ge2">e</span>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}
