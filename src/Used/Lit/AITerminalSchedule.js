import React, { useEffect, useState } from "react";
import schedule from "../../RhSchedule";
import "./AITerminalSchedule.css";
import chatlogo from "../../Images/Used/chat-logo.png"

export default function AITerminalSchedule({ day, animationDelay = 800, typingSpeed = 30 }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [botIntro, setBotIntro] = useState("");
  const [typedLines, setTypedLines] = useState([]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const scheduleLines = (schedule[day] || []).map(cls =>
    `${formatTime(cls.start)} — ${cls.name}`
  );

  useEffect(() => {
    // 1. Type the user prompt
    const promptText = `generate the schedule for ${day}`;
    let i = 0;
    const promptTimeout = setTimeout(() => {
      const promptInterval = setInterval(() => {
        setUserPrompt(promptText.slice(0, i + 1));
        i++;
        if (i >= promptText.length) {
          clearInterval(promptInterval);
          typeBotIntro();
        }
      }, typingSpeed);
    }, animationDelay);

    return () => clearTimeout(promptTimeout);
  }, [day]);

  const typeBotIntro = () => {
    const text = `Here is your schedule for ${day}:`;
    let i = 0;
    const interval = setInterval(() => {
      setBotIntro(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => typeLine(0), 300);
      }
    }, typingSpeed);
  };

  const typeLine = (idx) => {
    if (idx >= scheduleLines.length) return;
    const fullLine = scheduleLines[idx];
    let i = 0;

    const interval = setInterval(() => {
      setTypedLines(prev => {
        const updated = [...prev];
        updated[idx] = fullLine.slice(0, i + 1);
        return updated;
      });
      i++;
      if (i >= fullLine.length) {
        clearInterval(interval);
        setTimeout(() => typeLine(idx + 1), 300);
      }
    }, typingSpeed);
  };

  return (
    <div className="ai-wrapper">
      <div className="chat-header">
        <img src={chatlogo}/>
        <div className="chat-title">ChatGPT</div>
      </div>

      <div className="chat-bubble user">
        <code>{`> ${userPrompt}`}</code>
      </div>

      <div className="chat-bubble bot">
        <code>{botIntro}</code>
        {typedLines.map((line, idx) => (
          <div className="chat-line" key={idx}>
            <code>{line}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
