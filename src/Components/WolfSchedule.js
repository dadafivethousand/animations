import React, { useEffect, useState } from "react";
import "../Stylesheets/WolfSchedule.css";
import schedule from "../Schedule";

export default function WolfSchedule({ day, animationDelay = 1800, animationInterval = 250 }) {
  const [visibleArray, setVisibleArray] = useState([]);

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
    <div className="wolf-wrapper">
      <div className="wolf-ticker">
  <div className="wolf-ticker-track">
    <span className="green">Maple Jiu-Jitsu +304.5% ▲ $2,000,000</span>
       <span className="green">Richmond Hill Jiu-Jitsu +305.8% ▲ $1,725,859</span>
    <span className="green">AAPL +2.13% ▲ $193.27</span>
    <span className="red">TSLA -1.58% ▼ $173.89</span>
    <span className="green">NVDA +5.01% ▲ $956.22</span>
    <span className="red">GOOG -0.87% ▼ $137.45</span>
    <span className="green">META +1.92% ▲ $482.00</span>
      <span className="green">NFLX +3.23% ▲ $682.70</span>
    <span className="red">AMZN -2.05% ▼ $186.00</span>
       <span className="red">WALMART -3.05% ▼ $186.00</span>
   </div>
</div>

      <h1 className="wolf-title">{day.toUpperCase()}</h1>
      <div className="wolf-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="wolf-card" key={idx}>
              <span className="wolf-class">{cls.name}</span>
              <span className="wolf-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}