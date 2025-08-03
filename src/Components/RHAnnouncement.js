import React, { useEffect, useState } from 'react';
import './RHAnnouncement.css';

const RHAnnouncement = () => {
  const message = `Riichmond Hill Jiu-Jitsu Academy will be closed on Monday for the Civic Holiday. Classes at our Maple location (20 Cranston Park) will run as per the regular schedule.`;
  const nextMessage = `Alll students are welcome to attend there.`;

  const [text, setText] = useState('');
  const [nextText, setNextText] = useState('');

  useEffect(() => {
    let i = 0;
    const mainInterval = setInterval(() => {
      setText((prev) => prev + message.charAt(i));
      i++;
      if (i >= message.length) clearInterval(mainInterval);
    }, 50);
    return () => clearInterval(mainInterval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let j = 0;
      const nextInterval = setInterval(() => {
        setNextText((prev) => prev + nextMessage.charAt(j));
        j++;
        if (j >= nextMessage.length) clearInterval(nextInterval);
      }, 50);
    }, message.length * 50 + 250); // Wait until first message finishes + slight buffer

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="rh-announcement-container">
      <p className="rh-announcement-text">{text}</p>
      <p className="rh-announcement-text">{nextText}</p>
    </div>
  );
};

export default RHAnnouncement;
