import React, { useEffect, useRef, useState } from "react";
import "../Stylesheets/MatrixSchedule.css";
import schedule from "../Schedule"; // same shape: { Monday: [{ name, start }, ...], ... }

function MatrixSchedule({ day, animationDelay = 2000, animationInterval = 500 }) {
  const canvasRef = useRef(null);

  // For typing out the day
  const [displayDay, setDisplayDay] = useState("");
  // When we show the schedule
  const [showSchedule, setShowSchedule] = useState(false);
  // Which schedule items are visible
  const [visibleArray, setVisibleArray] = useState([]);

  /****************************************
   * 1) Matrix Canvas with More Code Lines
   ****************************************/
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Smaller font => more columns
    const fontSize = 12;
    let columns = Math.floor(canvas.width / fontSize);

    // Each element in drops represents the Y position of the "drop" in that column
    let drops = Array(columns).fill(0);

    // Characters used for the code
    const matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()-=+";

    function drawMatrix() {
      // Fill the canvas with a slightly more transparent black
      // so old characters remain longer => denser lines
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0"; // Matrix green
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(
          Math.floor(Math.random() * matrixChars.length)
        );
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Randomly reset the drop back to the top
        // Lowering from 0.975 to 0.95 => more frequent resets => more lines
        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const matrixInterval = setInterval(drawMatrix, 50);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      clearInterval(matrixInterval);
    };
  }, []);

  /*************************************
   * 2) Type Out the "day" prop
   *************************************/
  useEffect(() => {
    const typeTimer = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        setDisplayDay(day.substring(0, i + 1));
        i++;
        if (i >= day.length) {
          clearInterval(typingInterval);
        }
      }, 100);
    }, animationDelay);

    return () => clearTimeout(typeTimer);
  }, [day, animationDelay]);

  /****************************************
   * 3) Show the schedule after typed day
   ****************************************/
  useEffect(() => {
    // Wait a bit after typing finishes
    const showTimer = setTimeout(() => {
      setShowSchedule(true);
    }, animationDelay + 100 + day.length * 100);

    return () => clearTimeout(showTimer);
  }, [day, animationDelay]);

  /***********************************************
   * 4) Reveal schedule items one by one
   ***********************************************/
  useEffect(() => {
    if (showSchedule) {
      const classes = schedule[day] || [];
      classes.forEach((_, idx) => {
        setTimeout(() => {
          setVisibleArray((prev) => [...prev, idx]);
        }, idx * animationInterval);
      });
    }
  }, [showSchedule, day, animationInterval]);

  /********************************
   * 5) Time Formatter
   ********************************/
  const formatTime = (decimalTime) => {
    const hour = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hour) * 60);
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const amPm = hour < 12 ? "AM" : "PM";
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hour12}:${paddedMinutes} ${amPm}`;
  };

  return (
    <div className="matrix-container">
      {/* Canvas for the falling code */}
      <canvas ref={canvasRef} className="matrix-canvas" />

      {/* Overlay with typed day and schedule items */}
      <div className="matrix-overlay">
        <div className="matrix-day">{displayDay}</div>

        {showSchedule && (
          <div className="matrix-schedule">
            {(schedule[day] || []).map((cls, idx) =>
              visibleArray.includes(idx) ? (
                <div key={idx} className="matrix-class">
                  <span className="matrix-class-name">{cls.name}</span>
                  <span className="matrix-class-time">
                    {formatTime(cls.start)}
                  </span>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatrixSchedule;
