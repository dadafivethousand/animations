import React, { useEffect, useState } from "react";
import "../Stylesheets/Six.css";
import schedule from "../Schedule";
import FadeIn from "../Utils/FadeIn"

export default function Six9ineSchedule({ day, animationDelay = 1500, animationInterval = 200 }) {
  const [visibleArray, setVisibleArray] = useState([]);

  useEffect(() => {
    const classes = schedule[day] || [];
    classes.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, animationDelay + idx * animationInterval);
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = dt => {
    const hour = Math.floor(dt);
    const minutes = Math.round((dt - hour) * 60);
    const hr12 = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const mins = minutes < 10 ? `0${minutes}` : minutes;
    return `${hr12}:${mins} ${ampm}`;
  };

  return (
    <div className="six-container">
      <h1 className="six-header">{day.toUpperCase()}</h1>
      <div className="six-track">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="six-class-container">
            {visibleArray.includes(idx) && (
              <div className="six-class">
                <span className="six-class-name">{cls.name}</span>
                <span className="six-class-time">{formatTime(cls.start)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <FadeIn   speed = {3000} delay={1800} >
      <img src={'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnc5NThhMjZvMHQwbjZ5b2Nocm4wMmUwb3ExdDk2ZmNvc3ZwamdvcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/39m7vdeuZ5kQcNtNoN/giphy.gif'} />
  </FadeIn>
    
    </div>
  );
}
