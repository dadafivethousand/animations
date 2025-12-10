import React, { useEffect, useState } from "react";
import "./ASAPRockySchedule.css";
import schedule from "../RhSchedule";
import MapleJiuJitsuHeader from "./MapleJiuJitsuHeader";
 
export default function ASAPRockySchedule({
  day,
  animationDelay = 1700,
  animationInterval = 200,
}) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    setVisible([]);
    const items = schedule[day] || [];
    items.forEach((_, i) => {
      setTimeout(() => setVisible((v) => [...v, i]), animationDelay + i * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = (dt) => {
    const h = Math.floor(dt);
    const m = Math.round((dt - h) * 60);
    const hr12 = h % 12 === 0 ? 12 : h % 12;
    const ap = h < 12 ? "AM" : "PM";
    return `${hr12}:${m < 10 ? `0${m}` : m} ${ap}`;
  };

  return (
    <div className="ar-container">
  <div className="ar-header"> <MapleJiuJitsuHeader /> </div>
      <div className="ar-day">{day.toUpperCase()}</div>
      <div className="ar-track">
        {schedule[day]?.map(
          (cls, i) =>
            visible.includes(i) && (
              <div key={i} className="ar-class">
                <span className="ar-class-name">{cls.name}</span>
                <span className="ar-class-time">{formatTime(cls.start)}</span>
              </div>
            )
        )}
      </div>
    </div>
  );
}
