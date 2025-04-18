// src/components/BulletSpray.jsx
import React, { useState, useEffect } from 'react';
import '../Stylesheets/BulletSpray.css';

export default function BulletSpray({
  count = 15,       // fewer holes
  interval = 0.2,   // seconds between each shot
  size = 40         // fixed hole diameter in px
}) {
  const [holes, setHoles] = useState([]);

  useEffect(() => {
    let alive = true;
    for (let i = 0; i < count; i++) {
      const delay = i * interval;
      setTimeout(() => {
        if (!alive) return;
        setHoles(h => [
          ...h,
          {
            id:    i,
            top:   Math.random() * 100,
            left:  Math.random() * 100,
            rot:   Math.random() * 360,
            delay
          }
        ]);
      }, delay * 1000);
    }
    return () => { alive = false; };
  }, [count, interval]);

  return (
    <div className="bullet-spray-container">
      {holes.map(h => (
        <span
          key={h.id}
          className="bulletHole"
          style={{
            '--size':       `${size}px`,
            '--rot':        `${h.rot}deg`,
            top:            `${h.top}%`,
            left:           `${h.left}%`,
            animationDelay: `${h.delay}s`
          }}
        />
      ))}
    </div>
  );
}
