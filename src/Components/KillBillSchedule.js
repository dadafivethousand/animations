import React, { useEffect, useState } from "react";
import "../Stylesheets/KillBillSchedule.css";
import schedule from "../Schedule";
<<<<<<< HEAD

export default function KillBillSchedule({ day, animationDelay = 300, animationInterval = 150 }) {
  const [visibleArray, setVisibleArray] = useState([]);
=======
import uma from "../Images/Kill-Bill-Movies.webp"

export default function KillBillSchedule({ day, animationDelay = 2300, animationInterval = 150 }) {
  const [visibleArray, setVisibleArray] = useState([]);
  const [showImage, setShowImage] = useState(false)

  useEffect(()=>{
    setTimeout(() => {
        setShowImage(true)  
    }, 2000) 
  },[])
>>>>>>> 55eee1f72d40c8620bab47d864780de0e6d33879

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
<<<<<<< HEAD
    <div className="killbill-wrapper">
      <h3 className="killbill-title">{day.toUpperCase()}</h3>
=======
    <div className="killbill-outer-wrapper">
    <h3 className="killbill-title">{day.toUpperCase()}</h3>
    <div className="killbill-wrapper">
   
>>>>>>> 55eee1f72d40c8620bab47d864780de0e6d33879
      <div className="killbill-grid">
        {(schedule[day] || []).map((cls, idx) =>
          visibleArray.includes(idx) ? (
            <div className="killbill-card" key={idx}>
              <span className="killbill-class">{cls.name}</span>
              <span className="killbill-time">{formatTime(cls.start)}</span>
            </div>
          ) : null
        )}
      </div>
<<<<<<< HEAD
    </div>
=======
      <img className={`killbill ${showImage? 'killbill-show' : ''}`} src={uma}/>
    </div>
    </div>

>>>>>>> 55eee1f72d40c8620bab47d864780de0e6d33879
  );
}
