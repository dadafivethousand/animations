import React, { useEffect, useState } from "react";
import schedule from "../Schedule";
import "../Stylesheets/WolverineSchedule.css";

const DeadpoolWolverineSchedule = ({ day }) => {
  const [bulletHoles, setBulletHoles] = useState([]);

  useEffect(() => {
    let bullets = [];
    for (let i = 0; i < 5; i++) {
      bullets.push({
        id: i,
        top: `${Math.random() * 40 + 10}%`,
        left: `${Math.random() * 60 + 20}%`,
      });
    }

    let index = 0;
    const bulletInterval = setInterval(() => {
      setBulletHoles((prev) => [...prev, bullets[index]]);
      index++;

      if (index >= bullets.length) clearInterval(bulletInterval);
    }, 300);

    return () => clearInterval(bulletInterval);
  }, [day]);

  const classes = schedule[day] || [];

  return (
    <div className="wolverine-schedule-container">
      <div className="wolverine-day-title">
        {day}
        {bulletHoles.map(
          (hole) =>
            hole && (
              <span
                key={hole.id}
                className="wolverine-bullet-hole"
                style={{ top: hole.top, left: hole.left }}
              ></span>
            )
        )}
      </div>
      <div className="wolverine-schedule-list">
        {classes.map((cls, index) => (
          <div key={index} className="wolverine-arm-container">
            {/* Wolverine's Arm */}
            <div className="wolverine-arm">
              <div className="wolverine-glove"></div>
              <div className="wolverine-arm-muscle"></div>
              <span className="wolverine-class-name">
                {cls.name} - {formatTime(cls.start)}
              </span>
              {/* Realistic Claws */}
              <div className="wolverine-claws">
                <span className="real-claw"></span>
                <span className="real-claw"></span>
                <span className="real-claw"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatTime = (time) => {
  const hour = Math.floor(time);
  const minutes = (time % 1) * 60;
  const amPm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const formattedMinutes = minutes === 0 ? "00" : minutes;
  return `${formattedHour}:${formattedMinutes} ${amPm}`;
};

export default DeadpoolWolverineSchedule;
