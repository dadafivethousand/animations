import React, { useEffect, useState } from "react";
import "./TupacSchedule.css";
import schedule from "../RhSchedule";
import sandstorm from "../Images/965.jpg"

const quotes = [
  "Reality is wrong. Dreams are for real.",
  "I’m not saying I’m gonna change the world, but I guarantee that I will spark the brain that will.",
  "They got money for wars, but can’t feed the poor.",
];

function TupacSchedule({ day, animationDelay = 3000, animationInterval = 300 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [typedDay, setTypedDay] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      
   
    let i = 0;
    const interval = setInterval(() => {
      setTypedDay(day.substring(0, i + 1));
      i++;
      if (i > day.length) clearInterval(interval);
    }, 90);
  }, 2000);
  }, [day]);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay);
  }, [animationDelay]);

  useEffect(() => {
    if (!showSchedule) return;
    const entries = schedule[day] || [];
    entries.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleArray(prev => [...prev, idx]);
      }, idx * animationInterval);
    });
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };

  return (
    <div className="tupac-container">
      <img src={sandstorm}/>
      <div className="tupac-header">
        <h1 className="tupac-day">{typedDay}</h1>
      </div>

   

      <div className="tupac-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="tupac-class">
              <span className="tupac-class-name">{cls.name}</span>
              <span className="tupac-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
      <div className="tupac-image"></div>
    </div>
  );
}

export default TupacSchedule;
