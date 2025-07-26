import React, { useEffect, useState } from "react";
import "../Stylesheets/CodeNinjasSchedule.css";
import schedule from "../Schedule";

function CodeNinjasSchedule({ day, delay = 1800 }) {
  const [lines, setLines] = useState([]);
  const [typedLines, setTypedLines] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    const allLines = [`// ${day.toUpperCase()} SCHEDULE`];

    classes.forEach((cls) => {
      const time = formatTime(cls.start);
      allLines.push(`${(cls.name)} = "${time}";`);
    });

    setLines(allLines);
  }, [day]);

  useEffect(() => {
    const startTyping = async () => {
      await new Promise((res) => setTimeout(res, delay));
      for (const line of lines) {
        let typed = "";
        for (let i = 0; i <= line.length; i++) {
          setTypedLines((prev) => [...prev.slice(0, -1), line.substring(0, i) + (i < line.length ? "|" : "")]);
          await new Promise((res) => setTimeout(res, 25));
        }
        setTypedLines((prev) => [...prev, ""]);
      }
    };

    if (lines.length) {
      setTypedLines([""]);
      startTyping();
    }
  }, [lines, delay]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const camelize = (str) =>
    str
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s(.)/g, function (match, group1) {
        return group1.toUpperCase();
      })
      .replace(/\s/g, "")
      .replace(/^(.)/, function (match, group1) {
        return group1.toLowerCase();
      });

  return (
    <div className="ninja-terminal">
      {typedLines.map((line, idx) => (
        <div className="terminal-line" key={idx}>
          {line}
        </div>
      ))}
    </div>
  );
}

export default CodeNinjasSchedule;
