// VendingSchedule.jsx
//
// Richmond Hill Jiu-Jitsu — the day's classes as a vending machine.
//
// Each class is a product behind the glass on a numbered slot (A1, A2, B1…).
// The machine wakes up, the LED names the day, and then each coil turns in
// turn and pushes its item forward. The last one drops to the tray.
//
// Two things the data makes real rather than decorative:
//   - `maple` puts the item on a different shelf strip and prints MAPLE LOCATION
//     on its tag, because a class that runs at the other address is genuinely a
//     different product and somebody reading this needs to know before they drive.
//   - `replacement` keeps the house convention: the old name struck through and
//     the new one after it.
import React, { useEffect, useState } from "react";
import "../Stylesheets/VendingSchedule.css";
import schedule from "../RhSchedule";

// Slot codes run down the machine the way a real one does: a letter per shelf,
// a number per column. Four or five classes is one or two shelves.
const SLOT_LETTERS = ["A", "B", "C", "D"];
const PER_SHELF = 2;

const slotCode = (i) =>
  `${SLOT_LETTERS[Math.floor(i / PER_SHELF)] || "D"}${(i % PER_SHELF) + 1}`;

export default function VendingSchedule({
  day,
  animationDelay = 1100,
  animationInterval = 520,
}) {
  const [visible, setVisible] = useState([]);
  const [powered, setPowered] = useState(false);
  const [dropped, setDropped] = useState(false);

  const safeDay = day || "";
  const items = schedule[safeDay] || [];

  useEffect(() => {
    const timers = [];
    setVisible([]);
    setPowered(false);
    setDropped(false);

    timers.push(setTimeout(() => setPowered(true), 320));

    items.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setVisible((prev) => (prev.includes(i) ? prev : [...prev, i])),
          animationDelay + i * animationInterval
        )
      );
    });

    // the tray only matters once everything is on the shelves
    timers.push(
      setTimeout(
        () => setDropped(true),
        animationDelay + items.length * animationInterval + 420
      )
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [safeDay, items.length, animationDelay, animationInterval]);

  const formatTime = (decimalHour) => {
    const h = Math.floor(decimalHour);
    let m = Math.round((decimalHour - h) * 60);
    let hh = h;
    if (m === 60) {
      hh += 1;
      m = 0;
    }
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const ap = hh < 12 ? "AM" : "PM";
    return `${hour12}:${m < 10 ? `0${m}` : m} ${ap}`;
  };

  return (
    <div className="vend-stage">
      <div className={`vend-machine ${powered ? "is-on" : ""}`}>
        {/* ── Header: the machine's own branding ── */}
        <header className="vend-head">
          <span className="vend-brand">
            <span className="vend-brand-main">RICHMOND HILL</span>
            <span className="vend-brand-sub">JIU · JITSU</span>
          </span>
          <span className="vend-led" aria-live="polite">
            <span className="vend-led-dot" aria-hidden="true" />
            <span className="vend-led-txt">
              {safeDay ? safeDay.toUpperCase() : "SELECT"}
            </span>
          </span>
        </header>

        {/* ── The glass ── */}
        <div
          className="vend-glass"
          aria-label={`${safeDay || "Selected day"} schedule`}
        >
          <div className="vend-shelves">
            {items.map((cls, i) => {
              const shown = visible.includes(i);
              return (
                <div
                  className={`vend-row ${shown ? "is-out" : ""} ${
                    cls.maple ? "is-maple" : ""
                  }`}
                  key={i}
                >
                  <span className="vend-slot">{slotCode(i)}</span>

                  {/* the coil that turns and pushes the item forward */}
                  <span className="vend-coil" aria-hidden="true">
                    <i /><i /><i /><i /><i /><i />
                  </span>

                  <span className="vend-item">
                    <span className="vend-name">
                      {cls.replacement ? (
                        <>
                          <s className="vend-old">{cls.name}</s>
                          <span className="vend-arrow" aria-hidden="true">→</span>
                          <span className="vend-new">
                            {typeof cls.replacement === "string"
                              ? cls.replacement
                              : "Replacement"}
                          </span>
                        </>
                      ) : (
                        cls.short || cls.name
                      )}
                    </span>
                    <span className="vend-meta">
                      <time dateTime={String(cls.start)}>
                        {formatTime(cls.start)} – {formatTime(cls.end)}
                      </time>
                      {cls.maple && (
                        <span className="vend-tag">MAPLE LOCATION</span>
                      )}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* the shelf edges, drawn behind the rows */}
          <div className="vend-shelf-lines" aria-hidden="true">
            {Array.from({ length: Math.ceil(items.length / PER_SHELF) }).map(
              (_, i) => (
                <i key={i} />
              )
            )}
          </div>

          <span className="vend-reflection" aria-hidden="true" />
        </div>

        {/* ── Keypad + tray ── */}
        <footer className="vend-foot">
          <div className="vend-keypad" aria-hidden="true">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "0", "B"].map(
              (k) => (
                <span className="vend-key" key={k}>
                  {k}
                </span>
              )
            )}
          </div>

          <div className={`vend-tray ${dropped ? "is-full" : ""}`}>
            <span className="vend-tray-mouth" aria-hidden="true" />
            <span className="vend-tray-txt">
              {dropped ? "FIRST WEEK FREE" : "PUSH"}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
