import React, { useEffect, useState } from "react";
import "../Stylesheets/YugiohSchedule.css";
import scheduleData from "../Schedule";
import weekday from "../Images/ChatGPT Image Apr 12, 2025, 10_51_21 AM.png";
import  backImg from "../Images/Back-EN (1).png"
import yugioh from "../Images/yugioh.jpg"

function YugiohMobileSchedule({ day, animationDelay = 500, animationInterval = 700 }) {
  const [revealed, setRevealed] = useState(false);
  const [visibleIndices, setVisibleIndices] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  useEffect(() => {
    if (!revealed) return;

    const classes = scheduleData[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleIndices((prev) => [...prev, idx]);
      }, idx * animationInterval);
    });
  }, [revealed, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes < 10 ? "0" : ""}${minutes} ${amPm}`;
  };

  return (
    <div className="yugi-mobile-container">
      <div className="yugi-logo-title">
        <img className="yugi-day" src={weekday} />
      </div>

      <div className="yugi-cards-wrap">
        {(scheduleData[day] || []).map((cls, idx) => {
          const isFaceUp = visibleIndices.includes(idx);
          return (
            <YugiohCard
              key={idx}
              className={cls.name}
              time={formatTime(cls.start)}
              front={cls.image}
              back={cls.back}
              isFaceUp={isFaceUp}
              description={cls.description}
            />
          );
        })}
      </div>
      <img className='yugi-gif' src={yugioh} />
    </div>
  );
}

function YugiohCard({ className, time, front, back, isFaceUp, description }) {
 
 

  return (
    <div className="yugi-card-container">
      <div className={`yugi-card-inner ${isFaceUp ? "face-up" : ""}`}>
        {/* BACK */}
        <div className="yugi-card-face card-back">
          <img src={backImg} alt="Card Back" className="card-back-image" />
        </div>

        {/* FRONT */}
        <div className="yugi-card-face card-front">
          <div className="card-header">
       
            <span className="card-name">{className}</span>

          </div>
          <div className="card-image-area">
            <img src={front} alt="Class Artwork" className="card-monster-image" />
          </div>
          <div className="card-text-area">
            <p className="card-text-time"><strong>Time:</strong> {time}</p>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YugiohMobileSchedule;
