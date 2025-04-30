import React, { useEffect, useState } from 'react';
import '../Stylesheets/GameboySchedule.css';
import schedule from '../Schedule';


export default function GameboySchedule({
  day,
  animationDelay = 2300,
  animationInterval = 150
}) {
  const [visible, setVisible] = useState([]);
  const [turnOn, setTurnOn] = useState(false)


  useEffect(() => {
    const timer = setTimeout(() => {
      setTurnOn(true);
    }, 2000);
  
    return () => clearTimeout(timer); // cleanup
  }, []);
 

  useEffect(() => {
    setVisible([]);
    const entries = schedule[day] || [];
    entries.forEach((_, i) => {
      setTimeout(
        () => setVisible(prev => [...prev, i]),
        animationDelay + i * animationInterval
      );
    });
  }, [day, animationDelay, animationInterval]);

  const formatTime = dec => {
    const h = Math.floor(dec);
    const m = Math.round((dec - h) * 60)
      .toString()
      .padStart(2, '0');
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${m} ${h < 12 ? 'AM' : 'PM'}`;
  };

  return (
    <div className="gb-wrapper">
   
      <div className="gb-device">
        <div className="gb-power"><span>OFF</span><span>ON</span></div>
        <div className="gb-line"></div>
     

        <div className="gb-stripes">
          <div className="gb-stripe-lines">
            <div className="stripe purple" />
            <div className="stripe magenta" />
          </div>
          <div className="gb-stripe-label">DOT MATRIX WITH STEREO SOUND</div>
          <div className="gb-stripe-lines">
            <div className="stripe purple" />
            <div className="stripe magenta" />
          </div>
        </div>

        <div className="gb-screen-frame">
        <div className="gb-battery">
          <div className={ `${turnOn?'led':'dark'}`} />
          <span>BATTERY</span>
        </div>
          <div className={ `gb-dark-screen ${turnOn?'gb-screen':''}`}>
             <h1 className= {` ${turnOn? 'gb-title': 'gb-hide'}`} >{day.toUpperCase()}</h1>
            <div className="gb-grid">
              {schedule[day]?.map((cls, idx) =>
                visible.includes(idx) ? (
                  <div
                    className="gb-card"
                    key={idx}
                    style={{ '--idx': idx }}
                  >
                    <span>{cls.name}</span>
                    <span className="gb-time">{formatTime(cls.start)}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>

        <div className="gb-branding">
          <span className="nintendo">Nintendo </span>
          <span className="gameboy">GAME BOY™</span>
        </div>

        <div className="gb-controls">
          <div className="gb-dpad">
            <div className="gb-dpad-horizontal" />
            <div className="gb-dpad-vertical" />
          </div>
          <div className="gb-buttons">
            <div className="gb-btn b">B</div>
            <div className="gb-btn a">A</div>
          </div>
        </div>

        <div className="gb-small-buttons">
          <div className="gb-small-btn">SELECT</div>
          <div className="gb-small-btn">START</div>
        </div>

        <div className="gb-speaker">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="speaker-hole" key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
