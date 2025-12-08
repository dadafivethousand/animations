import React, { useEffect, useState } from "react";
import "./Windows98Schedule.css";
import schedule from "../../RhSchedule";
import windows from "../../Images/Used/Microsoft Windows 98 Wallpaper.jpeg"
import icons from "../../Images/Used/Windows 98 Icons are Great · Alex Meub.jpeg"
import startWidget from "../../Images/Used/Windows Start Widget.jpeg"

export default function Windows98Schedule({ day, animationDelay = 4000, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false)
  const [showSchedule2, setShowSchedule2] = useState(false)


  useEffect(()=> {
    setTimeout(() => {
        setShowSchedule(true)
    }, 2000);

      setTimeout(() => {
        setShowSchedule2(true)
    }, 3500);

    }, [])

  useEffect(() => {
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  return (
    <div className="win98-wrapper">
        <img className="win98-icons"  src={icons}/>
        <img className={`win98-logo ${showSchedule? 'win-98-show' : ''}`} src={windows}/>
      <div className={`win98-window ${showSchedule2 ? 'win-98-showSchedule': ''}`}>
        <div className="win98-titlebar">
          <span className="win98-title">{day.toUpperCase()} - Schedule.exe</span>
          <div className="win98-buttons">
            <span className="btn">_</span>
            <span className="btn">▢</span>
            <span className="btn">✕</span>
          </div>
        </div>
        <div className="win98-content">
          {schedule[day]?.map((cls, idx) =>
            visibleArray.includes(idx) ? (
              <div key={idx} className="win98-item">
                <span className="win98-class">{cls.name}</span>
                <span className="win98-time">{formatTime(cls.start)}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
      <div className="win98-taskbar">
  <div className="start-button">
    <img src={startWidget} alt="Start" />
  </div>
  <div className="taskbar-empty" />
</div>

    </div>
  );
}
