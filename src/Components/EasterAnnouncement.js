import React, { use, useEffect, useState } from "react";
import "../Stylesheets/EasterAnnouncement.css";
import easter from "../Images/easter.gif";

export default function EasterAnnouncement() {
  const [phase, setPhase] = useState(""); // future: use "typing", "done", etc
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(()=>{
    setTimeout(() => {
        setPhase("typing")
    }, 2000);
  })

  const message =
    "All classes are running as scheduled during the Easter weekend.";

  useEffect(() => {
    if (phase === "typing") {
      let i = 0;
      const interval = setInterval(() => {
        setTypedMessage(message.substring(0, i + 1));
        i++;
        if (i === message.length) {
          clearInterval(interval);
          setPhase("done");
        }
      }, 100); // Typing speed
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div className="easter-container">
      <div className="easter-eggs-background" />
      <div className="easter-card">
        <p className="easter-typewriter">{typedMessage}</p>
      </div>
      <img className="easter-bunny" src={easter} alt="Easter Bunny" />
    </div>
  );
}
