import React, { useEffect, useState } from "react";
import "../Stylesheets/GrandOpening.css";
import logo from "../Images/png/logo-no-background.png";
import TypewriterCycle from "../Utils/TypewriterCycle";
import FadeIn from "../Utils/FadeIn";
 
export default function GrandOpening() {
  const prizes = ["🥋 Adult Gi", "🥊 Boxing Gloves", "🎟️ Free Memberships", "👶 Kids Gi"];
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrizeIndex((prevIndex) => (prevIndex + 1) % prizes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grand-opening-container">
      <div className="background-overlay"></div>

      <div className="main-content">

        <FadeIn delay={2000} speed={1500}>
       
  <img className="main-logo" src={logo} alt="Logo" /> 
</FadeIn>
   
      <h2 className="academy-name">Richmond Hill Jiu-Jitsu Academy</h2>
        <h1 className="grand-title">GRAND OPENING</h1>

           <div className="prize-section">
          <div className="prize-title">Giving away free: <TypewriterCycle   texts={["gloves", "kimonos", "memberships"]} /> </div>
    
        </div>

     
      </div>

            <div className="vendor-section">
        <div className="vendor-heading">Special Guest <br></br>Vendor</div>
        <div className="vendor-content">
          <div className="vendor-logo-box">
            <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmR2cndkYXRhNmJndDFlYWRkeXBqNHhlYnRwbjNqeWtsbjBvNmthbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Su0H1ods7dTV2D9aY6/giphy.gif" alt="Mr. Puffs" className="mrpuffs-logo" />
                  </div>
          <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWFjMTNobDFkcngzNmhxeDVyNXZsM25zaXlqbnNhZDlib3B1MmJiZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/llfeeb4UCRCDVttMgn/giphy.gif"  className="mrpuffs-truck"/>
 
  
        </div>
      </div>

  
  
       <div className="event-details">
          📍 132 King Rd, Richmond Hill <br />
          📅 Saturday, June 7 — 12PM-3PM <br />
         </div>

    </div>
  );
}
