import React, { useEffect, useState } from "react";
import "../Stylesheets/KhabibNurmagomedovSchedule.css";
import schedule from "../Schedule";

function KhabibNurmagomedovSchedule({ day, animationDelay = 2000, animationInterval = 300 }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [visibleArray, setVisibleArray] = useState([]);
  const [displayDay, setDisplayDay] = useState("");
  const [addy, setAddy] = useState("");
  const [zoomPicture, setZoomPicture] = useState(false)

  const location = "Location:"
  const address = "20 Cranston Park, Maple, Ontario, Canada, L6A 2W2"
  useEffect(() => {
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayDay(location.substring(0, i + 1));
        i++;
        if (i > location.length) {
          clearInterval(interval);
        }
      }, 80);
    }, animationDelay);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setAddy(address.substring(0, i + 1));
        i++;
        if (i > address.length) {
          clearInterval(interval);
        }
      }, 80);
    }, 3000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay + 1500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setZoomPicture(true);
    },  500);
  }, []);


  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
      if (classes.length === 0) return;

      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }
  }, [showSchedule, day, animationInterval]);

  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="khabibnurmagomedov-container">
      <div class={`tenor-gif-embed ${zoomPicture ? 'zoom' : '' }`} data-postid="12994236" data-share-method="host" data-aspect-ratio="1.77778" data-width="100%"><a href="https://tenor.com/view/khabib-send-me-location-gif-12994236">Khabib Send GIF</a>from <a href="https://tenor.com/search/khabib-gifs">Khabib GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
      <div className="location">{displayDay}</div>
      <div className="addy">{addy}</div>
      <div className="khabibnurmagomedov-day">{day}</div>
      <div className="khabibnurmagomedov-schedule">
        {schedule[day]?.map((cls, idx) => (
          visibleArray.includes(idx) && (
            <div key={idx} className="khabibnurmagomedov-class">
              <span className="khabibnurmagomedov-class-name">{cls.name}</span>
              <span className="khabibnurmagomedov-class-time">{formatTime(cls.start)}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default KhabibNurmagomedovSchedule;
