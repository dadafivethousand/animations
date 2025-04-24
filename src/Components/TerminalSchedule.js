import React, { useEffect, useState } from "react";
import "../Stylesheets/TerminalSchedule.css";
import schedule from "../Schedule";

export default function TerminalSchedule({ day, animationInterval = 300, animationDelay = 1000 }) {
  const entries = schedule[day] || [];

  const [typedLines, setTypedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startTyping = () => {
      setIsTyping(true);
    };
    const delay = setTimeout(startTyping, animationDelay);
    return () => clearTimeout(delay);
  }, [animationDelay]);

  useEffect(() => {
    if (!isTyping || currentLine >= entries.length) return;

    const cls = entries[currentLine];
    const text = `~$ ${cls.name} — ${formatTime(cls.start)}`;

    if (currentChar < text.length) {
      const timer = setTimeout(() => {
        setTypedLines(prev => {
          const newLines = [...prev];
          newLines[currentLine] = (newLines[currentLine] || "") + text[currentChar];
          return newLines;
        });
        setCurrentChar(prev => prev + 1);
      }, 20);

      return () => clearTimeout(timer);
    } else {
      const lineTimer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, animationInterval);

      return () => clearTimeout(lineTimer);
    }
  }, [isTyping, currentChar, currentLine, entries, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="terminal-wrapper">
      <h1 className="terminal-title">~$ SCHEDULE FOR {day.toUpperCase()}</h1>
      <div className="terminal-output">
        {typedLines.map((line, idx) => (
          <div className="terminal-line" key={idx}>
            {line}
            {idx === currentLine && <span className="blinking-cursor-inline">█</span>}
          </div>
        ))}
        {currentLine >= entries.length && <div className="blinking-cursor-bottom">█</div>}
      </div>
    </div>
  );
}
