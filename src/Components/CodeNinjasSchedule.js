import React, { useEffect, useState } from "react";
import "../Stylesheets/CodeNinjasSchedule.css";
import schedule from "../Schedule";

function CodeNinjasSchedule({ day, delay = 800 }) {
  const [lines, setLines] = useState([]);
  const [typedLines, setTypedLines] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    const allLines = [`<span class="comment"># ${day.toUpperCase()} schedule</span>`];

    classes.forEach((cls) => {
      const time = formatTime(cls.start);
      allLines.push(
        `<span class="var">${snakeCase(cls.name)}</span> = <span class="string">"${time}"</span>`
      );
    });

    setLines(allLines);
  }, [day]);

  useEffect(() => {
    const startTyping = async () => {
      await new Promise((res) => setTimeout(res, delay));
      for (const line of lines) {
        let typed = "";
        for (let i = 0; i <= line.length; i++) {
          setTypedLines((prev) => [
            ...prev.slice(0, -1),
            line.substring(0, i) + (i < line.length ? "|" : ""),
          ]);
          await new Promise((res) => setTimeout(res, 20));
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

  const snakeCase = (str) =>
    str
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

  return (
    <div className="ninja-editor">
      {typedLines.map((line, idx) => (
        <div
          className="code-line"
          key={idx}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}
    </div>
  );
}

export default CodeNinjasSchedule;
