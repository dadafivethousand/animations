import React, { useEffect, useState } from "react";
import "../Stylesheets/CodeNinjasSchedule.css";
import schedule from "../Schedule";

function CodeNinjasSchedule({ day, delay = 800 }) {
  const [lines, setLines] = useState([]);
  const [typedLines, setTypedLines] = useState([]);
  const [displaying, setDisplaying] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    const allLines = [`# ${day.toUpperCase()} schedule`];

    classes.forEach((cls) => {
      const time = formatTime(cls.start);
      allLines.push(`${snakeCase(cls.name)} = "${time}"`);
    });

    setLines(allLines);
  }, [day]);

  useEffect(() => {
    const startTyping = async () => {
      await new Promise((res) => setTimeout(res, delay));
      const builtLines = [];

      for (const rawLine of lines) {
        let current = "";
        for (let i = 0; i <= rawLine.length; i++) {
          setTypedLines([...builtLines, current + (i < rawLine.length ? "|" : "")]);
          await new Promise((res) => setTimeout(res, 30));
          current = rawLine.substring(0, i);
        }
        builtLines.push(current);
      }

      setTypedLines([]);
      setDisplaying(builtLines);
    };

    if (lines.length) {
      setTypedLines([""]);
      setDisplaying([]);
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

  // Convert plain lines to highlighted syntax after typing finishes
  const highlight = (line) => {
    if (line.startsWith("#")) {
      return `<span class="comment">${line}</span>`;
    } else {
      const [variable, value] = line.split(" = ");
      return `<span class="var">${variable}</span> = <span class="string">${value}</span>`;
    }
  };

  return (
    <div className="ninja-editor">
      {typedLines.length > 0
        ? typedLines.map((line, i) => (
            <div className="code-line" key={i}>
              {line}
            </div>
          ))
        : displaying.map((line, i) => (
            <div
              className="code-line"
              key={i}
              dangerouslySetInnerHTML={{ __html: highlight(line) }}
            />
          ))}
    </div>
  );
}

export default CodeNinjasSchedule;
