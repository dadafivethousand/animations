import React from 'react';
import '../Stylesheets/MapleMarvel.css';
import { useState, useEffect } from 'react';

const MapleStudios = () => {

  const [fade, setFade] = useState(false)
  useEffect(()=>{
    setTimeout(() => {
      setFade(true)
    }, 2000);
  })
  return (
    <div className={`logo-container ${fade? 'fade':''}`}>
       <div className="maple-box">
        <span className="maple-text">MAPLE</span>
      </div>
      <div className="studios-box">
        <div className="line top-line"></div>
        <span className="studios-text">STUDIOS</span>
        <div className="line bottom-line"></div>
      </div>
  
    </div>
  );
};

export default MapleStudios;
