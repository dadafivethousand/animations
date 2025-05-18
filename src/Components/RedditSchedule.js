import React, { useEffect, useState } from "react";
import "../Stylesheets/RedditSchedule.css";
import schedule from "../Schedule";

import img1 from "../Images/1.webp";
import img2 from "../Images/2.webp";
import img3 from "../Images/3.webp";
import img4 from "../Images/4.webp";
import img5 from "../Images/5.webp";

const avatars = [img1, img2, img3, img4, img5];

export default function RedditSchedule({ day, animationDelay = 1500, animationInterval = 300 }) {
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
    <div className="reddit-thread-wrapper">
      <h1 className="reddit-thread-title">r/maplebjj — {day}</h1>
      <div className="reddit-thread">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="reddit-reply" key={idx} style={{ marginLeft: `${idx * 24}px` }}>
              <div className="vote-column">
                <div className="vote-arrow up">▲</div>
                <div className="vote-score">{Math.floor(Math.random() * 500) + 1}</div>
                <div className="vote-arrow down">▼</div>
              </div>
              <div className="reply-bar" />
              <div className="reply-content">
                <div className="reply-header">
                  <img
                    src={avatars[idx % avatars.length]}
                    alt="avatar"
                    className="avatar-img"
                  />
                  <span className="username">user{1000 + idx}</span> · {formatTime(cls.start)}
                </div>
                <div className="reply-text">{cls.name}</div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
