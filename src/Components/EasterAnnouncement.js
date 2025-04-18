import React, { useEffect, useState } from "react";
import "../Stylesheets/EasterAnnouncement.css";
import easter from "../Images/easter.gif";

export default function EasterAnnouncement() {
  const [typedMessage, setTypedMessage] = useState("");
  const [typedSecondMessage, setTypedSecondMessage] = useState("");

  const message = "All classes are running as scheduled during the Easter weekend.";
  const secondMessage = "See you on the mats!";

  // First message after 2s
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedMessage((prev) => {
          const next = message.substring(0, i + 1);
          i++;
          if (i === message.length) clearInterval(interval);
          return next;
        });
      }, 100);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Second message after 4s
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedSecondMessage((prev) => {
          const next = secondMessage.substring(0, i + 1);
          i++;
          if (i === secondMessage.length) clearInterval(interval);
          return next;
        });
      }, 100);
    }, 7000);
    return () => clearTimeout(timeout);
  }, []);

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
