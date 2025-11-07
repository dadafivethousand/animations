import React, { useEffect, useState } from "react";
import "./FemaleSamurai.css";
import schedule from "../../FemaleSamurai"; // Assuming schedule data exists
import Katana from "./Katana";

function FemaleSamurai({ day, animationDelay = 2500, animationInterval = 500 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [visibleImage, setVisibleImage] = useState(false);
  const [moveKatanas, setMoveKatanas] = useState(false);
  const [moveKatana, setMoveKatana] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setVisibleImage(true)
    }, 4000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMoveKatanas(true)
    }, 5000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setMoveKatana(true)
    }, 5500);
  }, []);



  useEffect(() => {
    setTimeout(() => {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }, animationDelay);
  }, [day, animationDelay, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (

  <div className="female-samurai-scroll">
    <div className="female-samurai-banner">
      <div className="female-samurai-banner-text">Women's Class</div>
    </div>

    <div className="female-samurai-paper">
      <div className="female-samurai-classes">
        {schedule[day]?.map((cls, idx) => (
          <div key={idx} className="female-samurai-entry-container">
            {visibleArray.includes(idx) && (
              <div className="female-samurai-entry female-samurai-slice">
                <div className="female-samurai-kanji">武</div>
                <div className="female-samurai-text">
                  <span className="female-samurai-class-name">{cls.name}</span>
                </div>
              </div>
            )}
          </div>
        ))}
 
      </div>
    </div>

    <div className={`female-samurai-image ${visibleImage ? 'female-samurai-show' : ''}`} />
  </div>
);


}

export default FemaleSamurai;
