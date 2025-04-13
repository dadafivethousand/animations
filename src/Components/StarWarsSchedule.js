import React, { useEffect, useState } from "react";
import "../Stylesheets/StarWarsSchedule.css";
import schedule from "../Schedule";
import starwarstext from "../Images/maple_jiu_jitsu_star_wars_style_final.png";
import RealisticLightsaber from "./RealisticLightsaber";
import GreenLightsaber from "./GreenLightsaber";

export default function StarWarsSchedule({ day, animationDelay = 1000, animationInterval = 300 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [fight, setFight] = useState(false)
  const [animation, setAnimation] = useState(false)
  const [red, setRed] = useState(false)



  useEffect(() => {
    const intervalId = setInterval(() => {
      setRed(prevRed => !prevRed); // Toggle the boolean
    }, 700);
  
    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);
  

  useEffect(() => {
    setTimeout(() => {
      setFight(true)
    }, 4000);

  }, []);



  useEffect(() => {
    setTimeout(() => {
      setAnimation(true)
    }, 500);

  }, []);

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
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <div className="sw-container">
      <div className={`starwars-swords ${animation? 'starwars-animate': ''}`}>
      <div className={`starwars-red ${fight? 'starwars-fight-red': ''}  ${red? 'starwars-lead-red': ''}`}>
      <RealisticLightsaber />
      </div>
      <div className={`starwars-green ${fight? 'starwars-fight-green': ''} `}>
      <GreenLightsaber />
      </div>
      </div>
      <div>
        <img className="starwars-text" src={starwarstext} alt="Star Wars–Style Text" />
      </div>
      <div className="starfield"></div>

      <h1 className="sw-title">{day.toUpperCase()}</h1>

      <div className="sw-schedule">
        {schedule[day]?.map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div key={idx} className="sw-class">
              <span className="sw-name">{cls.name}</span>
              <span className="sw-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
