import React, { useEffect, useState } from "react";
import Schedule from "../Schedule"; // Correct import path
import "../Stylesheets/PokemonSchedule.css";

export default function PokemonSchedule({ day }) {
  const todaysSchedule = Schedule[day] || [];
  const [isShaking, setIsShaking] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    // Shake the Pokéball for 2 seconds, then open it
    setTimeout(() => {
      setIsShaking(false);
      setIsOpening(true);
      setTimeout(() => {
        setShowSchedule(true);
      }, 700); // Delay for smooth reveal
    }, 2000); // Shake duration
  }, [day]);

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
    <div className="pokemon-container">
      {/* Pokémon Style Title */}
      <h1 className="pokemon-title">Maple Jiu-Jitsu</h1>

      {/* Pokéball */}
      <div className={`pokeball-container ${isShaking ? "shake" : ""} ${isOpening ? "open" : ""}`}>
        <div className="pokeball-top"></div>
        <div className={`${isOpening ? "none" : "pokeball-center"}`}></div>
        <div className="pokeball-bottom"></div>
      </div>

      {/* Schedule List */}
      <div className={`pokemon-schedule ${showSchedule ? "show" : ""}`}>
        <h2 className="pokemon-subtitle">{day.toUpperCase()}</h2>
        {todaysSchedule.map((event, index) => (
          <div key={index} className="pokemon-class">
            {event.name} {formatTime(event.start)}
          </div>
        ))}
      </div>
    </div>
  );
}
