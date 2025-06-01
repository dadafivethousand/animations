import React, { useState, useEffect } from 'react';
import '../Stylesheets/Poster.css';
import wolflogo from "../Images/wolflogo.png";
import Typewriter from '../Utils/utils';
import nobackgroundlogo from "../Images/png/logo-no-background.png"

export default function Poster() {
  const [showLogo, setShowLogo] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const [showTitle, setShowTitle] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 4000);
  }, []);

  useEffect(() => {
    setTimeout(() => setShowLogo(true), 1000);
  }, []);

  useEffect(() => { setTimeout(() => {
    setShowLogo(false)
  }, 2500);
  }, []);
  useEffect(() => {
    if (showContent) {
      setTimeout(() => setShowTitle(true), 500);
      setTimeout(() => setShowDate(true), 1000);
      setTimeout(() => setShowTime(true), 1500);
      setTimeout(() => setShowAddress(true), 2000);
      setTimeout(() => setShowRsvp(true), 2500);
    }
  }, [showContent]);

  return (
    <div className="poster-container">
      <div className={`poster-logo ${showLogo ? 'show-logo' : ''}`}>
        <img src={nobackgroundlogo} />
       
      </div>

      <div className={`poster-content ${showContent ? 'poster-content-show' : ""}`}>
        <div className="poster-overlay"></div>

        {showTitle && <h1 className="title float-in">GRAND OPENING</h1>}
 
        {showDate && <p className="date float-in">Saturday, June 7</p>}
        {showTime && <p className="time float-in">12:00 PM — 3:00 PM</p>}
        {showAddress && <p className="address float-in">132 King Road</p>}
        {showRsvp &&
          <div className="rsvp-box float-in">
            <p>DON'T MISS IT</p>
          </div>}
          <img className='no-background-logo' src={nobackgroundlogo}/>
      </div>
    </div>
  );
}
