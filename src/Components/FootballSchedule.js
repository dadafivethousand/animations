import React, { useEffect, useState } from "react";
import Schedule from "../Schedule"; // Adjust path accordingly
import "../Stylesheets/FootballSchedule.css";
 

export default function FootballSchedule({ day }) {
  const todaysSchedule = Schedule[day] || [];
 
  const [position, setPosition] = useState(0); // Tracks Y position
  const [x, setX] = useState(-100); // Horizontal position
  const [y, setY] = useState(0); // Vertical position (calculated)

  useEffect(() => {
    const interval = setInterval(() => {
      setX((prevX) => {
        const newX = prevX + 2; // Move right
        if (newX > 100) return -100; // Reset to loop
        return newX;
      });

      setY( 0.2*Math.pow(x, 2) + 205); // Quadratic equation for arch
    }, 50);

    return () => clearInterval(interval);
  }, [x]); // Depend on x so y updates correctly


  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev < 25 ? prev + 2 : -30)); // Reset when reaching 150px
    }, 50); // Adjust speed

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Convert time to AM/PM format
  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes === 0 ? "00" : Math.round(minutes);
    return `${formattedHours}:${formattedMinutes.toString().padStart(2, "0")} ${period}`;
  };

 
  return (
    <div className="football-field">
      <div className="football"
         style={{
            transform: `translate(${x}vw, ${y-200}px)`, // Rotate to mimic spinning
          }}>
      <div className={`stitching ${position >=25 ? 'none': ''} `} style={{ transform: `translate(-50%, ${position*3}px)` }}>
          <div className="horizontal"></div>
          <div className="stitch"></div>
          <div className="stitch"></div>
          <div className="stitch"></div>
          <div className="stitch"></div>
          <div className="stitch"></div>
          <div className="stitch"></div>
        </div>
      </div>
    </div>
  )
 
}
